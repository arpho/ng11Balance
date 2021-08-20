import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { offLineDbStatus } from '../models/offlineDbStatus';
import { OfflineItemServiceInterface } from '../models/offlineItemServiceInterface';
import { OfflineDbService } from './offline-db.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
  static servicesList: Array<OfflineItemServiceInterface> = []
  static staticLocalDb
  static _offlineDbStatus: BehaviorSubject<offLineDbStatus> = new BehaviorSubject(0)
  readonly offlineDbStatus: Observable<offLineDbStatus> = OfflineManagerService._offlineDbStatus.asObservable()
  constructor(private localDb: OfflineDbService) {
  }
  static evaluateDbStatus() {
    const statusList = OfflineManagerService.servicesList.map((service: OfflineItemServiceInterface) => {
      return service.offlineStatus || 0
    })

    const reducer = (acc: number, value: number, index, array: number[]) => {
      let val = acc + value;
      if (index === array.length - 1) {
        return val / array.length;
      };
      return val;
    };
    var status = statusList.reduce(reducer, 0)
    console.log('status', status)
    let out = 0;
    if (status == 0) {
      console.log('not init')
      out = offLineDbStatus.notInitialized
    }
    if (status == 1) {
      console.log('up2date')
      out = offLineDbStatus.up2Date
    }
    if (statusList.includes(2)) {
      console.log('syncing')
      out = offLineDbStatus.syncing
    }

    return out
  }

  static async registerService(service: any) {
    OfflineManagerService.servicesList.push(service)
    const db = new OfflineDbService()
    await db.DELETE_ALL()
    const entityStatus = await db.get(`${service.entityLabel}_status_db`)
    console.log('entity is ', entityStatus,service)
    if (entityStatus == offLineDbStatus.notInitialized || entityStatus == null) {
      const db = new OfflineDbService()
      
      service.offLineDbStatus = offLineDbStatus.syncing
     

      OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())

      
      console.log(`${service.entityLabel} need  to be initialized`)
      console.log(service)
      console.time('fetching')
      await service.fetchItemsFromCloud(async (items) => {
        items.forEach(async (item) => {
          item.item['entityLabel'] = service.entityLabel
          await db.set(item.key, item.item)

        })
        await db.set(`${service.labelEntity}_status_db`, offLineDbStatus.up2Date)
        console.log('synced', service.key,service.labelEntity)
        service.localStatus = offLineDbStatus.up2Date
        OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())
        console.timeEnd('fetching')
      })
    }
  }
}
