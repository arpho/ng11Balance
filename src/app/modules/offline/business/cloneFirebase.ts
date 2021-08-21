import { offLineDbStatus } from "../models/offlineDbStatus";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { RawItem } from "../models/rawItem";
import { OfflineDbService } from "../services/offline-db.service";
import { OfflineManagerService } from "../services/offline-manager.service";

export class CloneEntityFromFirebase{
    service
    db
    constructor(service:OfflineItemServiceInterface,db:OfflineDbService){
        this.service=service
        this.db= db
        service.offlineDbStatus = offLineDbStatus.syncing

      
    }

    async execute(){
        OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())

      
      console.log(`${this.service.entityLabel} needs  to be initialized`)
      console.log(this.service)
      console.time('fetching')
      await this.service.fetchItemsFromCloud(async (items) => {
        items.forEach(async (item:RawItem) => {
          item.item['entityLabel'] = this.service.entityLabel
          await OfflineManagerService.staticLocalDb.set(item.key, item.item)

        })
        console.log('setting',`${this.service.entityLabel}_status_db`)
        await OfflineManagerService.staticLocalDb.set(`${this.service.entityLabel}_status_db`, offLineDbStatus.up2Date)
        this.service.offlineDbStatus = offLineDbStatus.up2Date
        console.log('publishing new status',OfflineManagerService.evaluateDbStatus())
        OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())
        console.timeEnd('fetching')
      })
    }
}