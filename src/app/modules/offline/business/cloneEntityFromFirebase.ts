import { offLineDbStatus } from "../models/offlineDbStatus";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { RawItem } from "../models/rawItem";
import { OfflineDbService } from "../services/offline-db.service";

export class CloneEntity {
  db: OfflineDbService
  service: OfflineItemServiceInterface
  constructor(db: OfflineDbService, service: OfflineItemServiceInterface) {
    this.db = db
    this.service = service
  }
  async execute() {
    console.time(`fetching from ${this.service.entityLabel}`)
    await this.service.fetchItemsFromCloud(async (items) => {
      console.log(`fetching ${items.length} items from ${this.service.entityLabel}`)
      items.forEach(async (item: RawItem) => {
        item.item['entityLabel'] = this.service.entityLabel
        await this.db.set(item.key, item.item)


      })
      await this.db.set(`${this.service.entityLabel}_status_db`, offLineDbStatus.up2Date)
      console.log('synced', this.service.entityLabel)
      this.service.offlineDbStatus = offLineDbStatus.up2Date
      console.timeEnd(`fetching from ${this.service.entityLabel}`)
    })
  }

}