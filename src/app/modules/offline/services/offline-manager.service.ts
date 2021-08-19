import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { offLineDbStatus } from '../models/offlineDbStatus';
import { OfflineItemServiceInterface } from '../models/offlineItemServiceInterface';
import { OfflineDbService } from './offline-db.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
  static servicesList: Array<any> = []
  static staticLocalDb
  static _offlineDbStatus: BehaviorSubject<offLineDbStatus> = new BehaviorSubject(0)
  readonly offlineDbStatus: Observable<offLineDbStatus> = OfflineManagerService._offlineDbStatus.asObservable()
  constructor(private localDb:OfflineDbService) { 
  }

   static async registerService(service: any) {
    OfflineManagerService.servicesList.push(service)
    const db = new OfflineDbService()
     const entityStatus = await db.get(`${service.labelEntity}_status_db`)
    console.log('entity is ',entityStatus) 
    if(entityStatus==offLineDbStatus.notInitialized||entityStatus==null){
      const db = new OfflineDbService()
      const res = await db.DELETE_ALL()
      console.log('deleted',res )
      
     /*  service.localStatus=offLineDbStatus.syncing
      console.log(`${service.entityLabel} need  to be initialized`)
      console.log(service)
      await service.fetchItemsFromCloud( async (items)=>{
        items.forEach(async (item)=>{
          item.item['entityLabel']= service.entityLabel
        await  db.set(item.key,item.item)
          
        })
        await db.set(`${service.labelEntity}_status_db`,offLineDbStatus.up2Date)
        console.log('synced',service.key)
        service.localStatus= offLineDbStatus.up2Date
        OfflineManagerService._offlineDbStatus.next
      }) */
    }
  }
}
