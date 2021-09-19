import { service } from "firebase-functions/v1/analytics";
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


     entitiesRestore = (items: RawItem[]) =>/**
        initializes the entities inside the changes
        */ {
            this.changes = []
            items.forEach(item => {
                console.log('pulling ',item,this.services)
                const Service = this.services.filter(service => service.entityLabel == item.item['entity'])[0]
                if(Service){
                const entity = Service.getDummyItem().initialize(item.item)
           
                const change = new Items2Update(item.item['owner'], entity, item.item['operation']).setItem(entity)
                change.date = new DateModel(new Date(item.item['date']))
                this.changes.push(change)}
            })

            console.log('changes',this.changes)
            return this
        }

    async restoreEntities() {

        
        this.Changes.fetchItemsFromCloud(this.entitiesRestore)
        return this
    }

    async applyChangesnotOwnedByMe() {
        console.log('applying changes')
        this.changes.filter(change=>!change.isSignedBy(this.signature)).forEach(async change => {// store only not signeed changes
            console.log('change',change.operationKey)
            if (change.operationKey == OperationKey.create) {
                console.log('creation')
                await this.localDb.set(change.item.key, change.item.serialize4OfflineDb())
                console.log('after creation',this.localDb)
            }
            if (change.operationKey == OperationKey.update) {
                await this.localDb.set(change.item.key, change.item.serialize4OfflineDb())
                console.log('after update',this.localDb )
            }
            if (change.operationKey == OperationKey.delete) {
                await this.localDb.remove(change.item.key)
            }
            change.sign(this.signature)
        })
        return this
    }

    async updateChanges(){
        this.changes.forEach(async change=>{
          await  this.Changes.updateItem(change)
        })

        return this
    }

    async removeOldChanges()/**rremove older than a month changes */
    {const oneMonth= 60*60 // secs in a minute
        *60 //secs in one hour
        *24 // secs in day
        *30 // secs in a month
        *1000 // msecs in a month
        const today = new Date()
        this.changes.filter(change=>today.getTime()-change.date.getTime()>oneMonth).forEach(async change=>{
         await    this.Changes.deleteItem(change.key)
        })
        return this
    }

}