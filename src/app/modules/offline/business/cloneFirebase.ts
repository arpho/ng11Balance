import { offLineDbStatus } from "../models/offlineDbStatus";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { RawItem } from "../models/rawItem";
import { OfflineDbService } from "../services/offline-db.service";

export class CloneEntityFromFirebase{
    service
    db
    constructor(service:OfflineItemServiceInterface,db:OfflineDbService){
        this.service=service
        this.db= db
        service.offlineDbStatus = offLineDbStatus.syncing

      
    }

    async execute(){

      
      console.log(`${this.service.entityLabel} needs  to be initialized`)
      console.log(this.service)
      console.time('fetching')
      await this.service.fetchItemsFromCloud(async (items) => {
        items.forEach(async (item:RawItem) => {
          item.item['entityLabel'] = this.service.entityLabel
          await this.db.set(item.key, item.item)

        })
        console.log('setting',`${this.service.entityLabel}_status_db`)
        await this.db.set(`${this.service.entityLabel}_status_db`, offLineDbStatus.up2Date)
        this.service.offlineDbStatus = offLineDbStatus.up2Date
        console.timeEnd('fetching')
      })
    }
}