//import { service } from "firebase-functions/v1/analytics";
import { isTypeNode } from "typescript";
import { DateModel } from "../../user/models/birthDateModel";
import { Items2Update } from "../models/items2Update";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { OperationKey } from "../models/operationKey";
import { RawItem } from "../models/rawItem";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";

export class Puller {
    changes: Items2Update[]
    Changes: ChangesService
    signature: string
    services: OfflineItemServiceInterface[]
    localDb: OfflineDbService
    constructor(localDb: OfflineDbService, signature: string, services: OfflineItemServiceInterface[], Changes: ChangesService) {
        this.localDb = localDb
        this.signature = signature
        this.services = services
        this.Changes = Changes
    }


    entitiesRestore = (items: RawItem[]) =>/**
        initializes the entities inside the changes
        */ {
        this.changes = []
        items.forEach(item => {
            console.log("#* parsed restoring", item)
            const Service = this.services.filter(service => service.entityLabel == item.item['entity'])[0]
            if (Service) {
                try {
                    const parsedItem = JSON.parse(item.item['item'])
                    console.log("#* parsed item", parsedItem)
                }
                catch (e) {
                }
                const entity = Service.getDummyItem().initialize((item.item)).setKey(item.item['key']) as OfflineItemModelInterface
                console.log("#* parsed restored", entity)
                const change = new Items2Update(item.item['owner'], entity, item.item['operation']).setItem(entity)
                change.date = new DateModel(new Date(item.item['date']))
                this.changes.push(change)

            }
        })
        console.log("changes", this.changes)
        return this
    }

    async restoreEntities() {


        this.Changes.fetchItemsFromCloud(this.entitiesRestore)
        return this
    }

    async applyChangesnotOwnedByMe() {
        this.changes.filter(change => !change.isSignedBy(this.signature)).forEach(async change => {// store only not signeed changes

            if (change.operationKey == OperationKey.create) {
                console.log("item to be created", change)
                console.log("signature ", change.item.serialize4OfflineDb())

                await this.localDb.set(change.item.key, change.item.serialize4OfflineDb())
            }
            if (change.operationKey == OperationKey.update) {
                console.log("item to be updated", change)
                await this.localDb.set(change.item.key, change.item.serialize4OfflineDb())
            }
            if (change.operationKey == OperationKey.delete) {
                console.log("item to be deleted", change)
                await this.localDb.remove(change.item.key)
            }
            change.sign(this.signature)
        })
        return this
    }

    async updateChanges() {
        console.log('changes', this.changes.length)
        this.changes.forEach(async change => {
            //console.log('change',change)
            await this.Changes.updateItem(change)
        })

        return this
    }

    async removeOldChanges()/**rremove older than a month changes */ {
        const oneMonth = 60 * 60 // secs in a minute
            * 60 //secs in one hour
            * 24 // secs in day
            * 30 // secs in a month
            * 1000 // msecs in a month
        const today = new Date()
        this.changes.filter(change => today.getTime() - change.date.getTime() > oneMonth).forEach(async change => {
            await this.Changes.deleteItem(change.key)
        })
        return this
    }

}