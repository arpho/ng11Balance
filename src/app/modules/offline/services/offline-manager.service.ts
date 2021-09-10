import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersService } from '../../user/services/users.service';
import { CloneEntity } from '../business/cloneEntityFromFirebase';
import { StoreSignature } from '../business/storeSignatureOnLocalDb';
import { offLineDbStatus } from '../models/offlineDbStatus';
import { OfflineItemServiceInterface } from '../models/offlineItemServiceInterface';
import { ChangesService } from './changes.service';
import { OfflineDbService } from './offline-db.service';
import { take, first } from 'rxjs/operators';
import { of, pipe } from 'rxjs'
import { Items2Update } from '../models/items2Update';
import { pullChangesFromCloud } from '../business/pullFromCloud';

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
  static servicesList: Array<OfflineItemServiceInterface> = []
  servicesList: Array<OfflineItemServiceInterface> = []
  static staticLocalDb
  static _offlineDbStatus: BehaviorSubject<offLineDbStatus> = new BehaviorSubject(0)
  static offlineDbStatus: Observable<offLineDbStatus> = OfflineManagerService._offlineDbStatus.asObservable()




  constructor(public localDb: OfflineDbService, public users: UsersService, public changes: ChangesService) {
    // this.pullChangesFromCloud()
    //this.localDb.clear()



    this.makeSignature(async sign => {

      await new StoreSignature(this.localDb, sign).execute()
    })


  }

  async pullChangesFromCloud() {
    const changes: Items2Update[] = []
    const pull = new pullChangesFromCloud(this.changes, this.localDb)
    this.changes.items.subscribe(async items => {
      items.forEach(item => {
        const Service = this.servicesList.filter(service => service.entityLabel == item.entityLabel2Update)[0]
        const entity = Service.getDummyItem().initialize(item.item)
        const change = new Items2Update(item.owner, entity, item.operationKey)
        change.item = entity
        changes.push(change)
      })
      const signature = await this.asyncSignature()
      await pull.execute(changes,signature)
      console.log('* signature', signature)
      const changes2Pull = changes.filter(change => !change.isSignedBy(signature))
      console.log('changes 2 pull *', changes2Pull)

    })
  }

  sign(uid: string) {
    return `${uid}_${navigator.platform}_${this.getBrowserName()}`
  }

  makeSignature(next) {

    this.users.loggedUser.subscribe(user => {
      if (user.uid) {
        next(this.sign(user.uid))
      }
    })


  }

  async asyncSignature() {
    const user = await this.users.loggedUser.pipe(take(1)).toPromise()
    return this.sign(user.uid)
  }

  getBrowserName() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
      return 'Opera';
    } else if (window.navigator.userAgent.indexOf("Edge") != -1) {
      return "Edge";
    }
    else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return 'Firefox';

    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.DOCUMENT_NODE == true)) {
      1
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
    const service = OfflineManagerService.servicesList.filter((service: OfflineItemServiceInterface) => service.entityLabel == entity)[0]
    service?.publish(await service.loadItemFromLocalDb())



  }

  async isLoggedUserOflineEnabled() {
    const user = await this.users.loggedUser.pipe(take(1)).toPromise()
    return user.isOfflineEnabled()
  }

  async registerService(service: OfflineItemServiceInterface) {
    if (!OfflineManagerService.servicesList.map(service => service.entityLabel).includes(service.entityLabel)) {
      console.log('registering', service.entityLabel)
      OfflineManagerService.servicesList.push(service)
      this.servicesList.push(service)

      service.setHref()
    }
    const entityStatus = await this.getOfflineDbStatus(service.entityLabel)
    if (entityStatus == offLineDbStatus.notInitialized || entityStatus == null) {
      console.log(`initializing ${service.entityLabel}`)
      new CloneEntity(this.localDb, service).execute()
      const db = new OfflineDbService()

      service.offlineDbStatus = offLineDbStatus.syncing

      OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())


      await new CloneEntity(db, service).execute()
      OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())

      service.publish(service.initializeItems(await this.localDb.fetchAllRawItems4Entity(service.entityLabel)))
    }
    else if (entityStatus == 1) {
      console.log('db ready')
      console.log('load from local')
      service.publish(service.initializeItems(await this.localDb.fetchAllRawItems4Entity(service.entityLabel)))

    }


  }

}
