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
  _offlineDbStatus: BehaviorSubject<offLineDbStatus> = new BehaviorSubject(0)
  readonly offlineDbStatus: Observable<offLineDbStatus> = this._offlineDbStatus.asObservable()
  constructor(private localDb:OfflineDbService) { 
  }

   static async registerService(service: any) {
    OfflineManagerService.servicesList.push(service)
    const db = new OfflineDbService()
     const entityStatus = await db.get(`${service.labelEntity}_status_db`)
    console.log('entity is ',entityStatus) 
    if(entityStatus==offLineDbStatus.notInitialized||entityStatus==null){
      console.log(`${service.entityLabel} need  to be initialized`)
      console.log(service)
      service.fetchItemsFromCloud((items)=>{console.log('got',items)})
    }
  }
}
