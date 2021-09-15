import { DateModel } from "../../user/models/birthDateModel";
import { Items2Update } from "../models/items2Update";
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

    async fetchChangesFromFirebase() {

        const entitiesRestore = (items: RawItem[]) =>/**
        initializes the entities inside the changes
        */ {
            this.changes = []
            items.forEach(item => {
                const Service = this.services.filter(service => service.entityLabel == item.item['entityLabel2Update'])[0]
                const entity = Service.getDummyItem().initialize(item.item)
                const change = new Items2Update(item['owner'], entity, item['operationKey']).setItem(entity)
                change.date = new DateModel(new Date(item.item['date']))
                this.changes.push(change)
            })

        }
        this.Changes.fetchItemsFromCloud(entitiesRestore)
        return this
    }

    async storeChanges() {
        this.changes.forEach(async change => {
            if (change.operationKey == OperationKey.create) {
                await this.localDb.set(change.item.key, change.item.serialize4OfflineDb())
            }
            if (change.operationKey == OperationKey.update) {
                await this.localDb.set(change.item.key, change.item.serialize4OfflineDb())
            }
            if (change.operationKey == OperationKey.delete) {
                await this.localDb.remove(change.item.key)
            }
            change.sign(this.signature)
        })
        return this
    }

}