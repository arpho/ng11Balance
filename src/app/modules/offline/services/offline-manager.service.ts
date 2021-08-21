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
  static offlineDbStatus: Observable<offLineDbStatus> = OfflineManagerService._offlineDbStatus.asObservable()
  constructor(private localDb: OfflineDbService) {
    OfflineManagerService.offlineDbStatus.subscribe(status=>{console.log('actual status',status)})
    OfflineManagerService.staticLocalDb = new OfflineDbService()
  }
  static evaluateDbStatus() {
    const statusList = OfflineManagerService.servicesList.map((service: OfflineItemServiceInterface) => {
      return service.offlineStatus || 0
    })
    console.log('status list',statusList)
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
    
    console.log('registering',service,service.key,service.entityLabel)
    console.log('setting ',`${service.entityLabel}_status_db`)
    OfflineManagerService.servicesList.push(service)

    const entityStatus = await OfflineManagerService.staticLocalDb.get(`${service.entityLabel}_status_db`)
    if (entityStatus == offLineDbStatus.notInitialized || entityStatus == null) {
       
      
      service.offLineDbStatus = offLineDbStatus.syncing

      OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())

      
      console.log(`${service.entityLabel} needs  to be initialized`)
      console.log(service)
      console.time('fetching')
      await service.fetchItemsFromCloud(async (items) => {
        items.forEach(async (item) => {
          item.item['entityLabel'] = service.entityLabel
          await OfflineManagerService.staticLocalDb.set(item.key, item.item)

        })
        console.log('setting',`${service.entityLabel}_status_db`)
        await OfflineManagerService.staticLocalDb.set(`${service.entityLabel}_status_db`, offLineDbStatus.up2Date)
        console.log('synced', service.key,service.entityLabel)
        service.localStatus = offLineDbStatus.up2Date
        console.log('publishing new status',OfflineManagerService.evaluateDbStatus())
        OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())
        console.timeEnd('fetching')
      })
    }
    else if(entityStatus==1){
      console.log('db ready')
    }
  }
}
