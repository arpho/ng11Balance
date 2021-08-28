import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersService } from '../../user/services/users.service';
import { CloneEntity } from '../business/cloneEntityFromFirebase';
import { StoreSignature } from '../business/storeSignatureOnLocalDb';
import { offLineDbStatus } from '../models/offlineDbStatus';
import { OfflineItemServiceInterface } from '../models/offlineItemServiceInterface';
import { ChangesService } from './changes.service';
import { OfflineDbService } from './offline-db.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
  static servicesList: Array<OfflineItemServiceInterface> = []
  static staticLocalDb
  static _offlineDbStatus: BehaviorSubject<offLineDbStatus> = new BehaviorSubject(0)
  static offlineDbStatus: Observable<offLineDbStatus> = OfflineManagerService._offlineDbStatus.asObservable()


  constructor(public localDb: OfflineDbService, public users: UsersService) {

    this.makeSignature(async sign => {
      console.log('signature', sign)

      await new StoreSignature(this.localDb, sign).execute()
    })
    

  }


  makeSignature(next) {

    this.users.loggedUser.subscribe(user => {
      if (user.uid) {
        next(`${user.uid}_${navigator.platform}_${this.getBrowserName()}`)
      }
    })


  }

  getBrowserName() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.DOCUMENT_NODE == true)) {
      return 'Internet Explorer';
    } else {
      return 'Not sure!';
    }
  }


  static evaluateDbStatus() {
    const statusList = OfflineManagerService.servicesList.map((service: OfflineItemServiceInterface) => {
      return service.offlineDbStatus || 0
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
  async getOfflineDbStatus(entityLabel: string) {

    return this.localDb.get(`${entityLabel}_status_db`)
  }

  static async publishEntity(entity: string) {
    console.log('refresh ', entity)
    const service = OfflineManagerService.servicesList.filter((service: OfflineItemServiceInterface) => service.entityLabel == entity)[0]
    console.log('publish to ',service)
    service.publish(await service.loadItemFromLocalDb())



  }

  async registerService(service: OfflineItemServiceInterface) {

    console.log('registering service',service)
    OfflineManagerService.servicesList.push(service)
    service.setHref()

    const entityStatus = await this.getOfflineDbStatus(service.entityLabel)
    if (entityStatus == offLineDbStatus.notInitialized || entityStatus == null) {
      const db = new OfflineDbService()

      service.offlineDbStatus = offLineDbStatus.syncing

      OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())


      await new CloneEntity(db, service).execute()
      OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())
    }
    else if (entityStatus == 1) {
      console.log('db ready')
      console.log('load from local')

      service.publish(service.initializeItems(await this.localDb.fetchAllRawItems4Entity(service.entityLabel)))
    }
  }
}
