import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CloneEntity } from '../business/cloneEntityFromFirebase';
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
  }
  static evaluateDbStatus() {
    const statusList = OfflineManagerService.servicesList.map((service: OfflineItemServiceInterface) => {
      return service.offlineDbStatus || 0
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

  static async registerService(service:any) {
    
    console.log('registering',typeof service,service)
    console.log('setting ',`${service.entityLabel}_status_db`)
    OfflineManagerService.servicesList.push(service)
    const db = new OfflineDbService()
    const entityStatus = await db.get(`${service.entityLabel}_status_db`)
    if (entityStatus == offLineDbStatus.notInitialized || entityStatus == null) {
      const db = new OfflineDbService()
      
      service.offlineDbStatus = offLineDbStatus.syncing

      OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())

      
      console.log(`${service.entityLabel} needs  to be initialized`)
      console.log(service)
      new CloneEntity(db,service).execute()

      console.log('publishing new status',OfflineManagerService.evaluateDbStatus())
      OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())
    }
    else if(entityStatus==1){
      console.log('db ready')
      console.log('load from local')
      const rawItems = await db.fetchAllRawItems4Entity(service.entityLabel)
      console.log('raw items',rawItems.length)

      const items = await service.initializeItems(rawItems)
      console.log('items',items)
    }
  }
}
