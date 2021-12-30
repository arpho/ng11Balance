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
import { ConnectionStatusService } from './connection-status.service';
import { Push2Cloud } from '../business/push2Cloud';
import { Puller } from '../business/puller';
import { configs } from 'src/app/configs/configs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { RebaseEntity } from '../business/rebaseEntity';

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
  static servicesList: Array<OfflineItemServiceInterface> = []
  servicesList: Array<OfflineItemServiceInterface> = []
  static staticLocalDb
  static _offlineDbStatus: BehaviorSubject<offLineDbStatus> = new BehaviorSubject(0)
  static offlineDbStatus: Observable<offLineDbStatus> = OfflineManagerService._offlineDbStatus.asObservable()

  _msg: BehaviorSubject<string> = new BehaviorSubject('')
  readonly msg: Observable<string> = this._msg.asObservable()

  publishMessage(msg: string) {
    this._msg.next(msg)
  }




  constructor(public localDb: OfflineDbService,
    public users: UsersService,
    public changes: ChangesService,
    connection: ConnectionStatusService) {
    this.pullChangesFromCloud()
    connection.monitor(async status => {
      console.log('monitor', status)
      if (status) {
        this.syncChanges()
      }
    })
   




    /**
     * signs he db
     */
    this.makeSignature(async sign => {

      await new StoreSignature(this.localDb, sign).execute()
    })


  }
  async syncChanges() {
    await this.pullChangesFromCloud()
    await this.push2Cloud()
    console.log('syncing changes')

  }
  async push2Cloud() {
    new Push2Cloud(this.localDb, this.servicesList)

  }

  refreshItems() {
    /** fetch all items from local db and publishes the items */
    this.servicesList.forEach(async service => {
      service.publish(service.initializeItems(await this.localDb.fetchAllRawItems4Entity(service.entityLabel)))
    })
  }

  async pullChangesFromCloud() {
    const puller = new Puller(this.localDb, await this.asyncSignature(), this.servicesList, this.changes)
    this.changes.fetchItemsFromCloud(changes => puller.// download changes
      entitiesRestore(changes).// resdtore entities in changes
      applyChangesnotOwnedByMe().// apply the changes on local db
      finally(() => {
        puller.
          updateChanges().finally(() => { // update changes on firebase 
            puller.
              removeOldChanges() //remove old changes older than a month
            this.refreshItems()

          })
      }))
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
    let out = 0;
    if (status == 0) {
      out = offLineDbStatus.notInitialized
    }
    if (status == 1) {
      out = offLineDbStatus.up2Date
    }
    if (statusList.includes(2)) {
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

  async rebaseDb() {
    await this.push2Cloud() // upload not synched changes
    await this.localDb.clear()
    this.makeSignature(async sign => {

      await new StoreSignature(this.localDb, sign).execute()
    })
    const refreshStatus = () => { OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus()) }
    const synchonizer = new RebaseEntity(this.localDb, refreshStatus)
    //clones entiites for every service
    this.servicesList.forEach(async service => {
      await synchonizer.synchronizes(service, (data) => {
        this.publishMessage(`synchronized ${data} items for  ${service.entityLabel}`)
      })


    })
  }

  async registerService(service: OfflineItemServiceInterface) {
    if (!OfflineManagerService.servicesList.map(service => service.entityLabel).includes(service.entityLabel)) {
      OfflineManagerService.servicesList.push(service)
      this.servicesList.push(service)

      service.setHref()
      if (this.servicesList.length == configs.offlineEntityNumber) {
        await this.syncChanges()
      }
    }
    const entityStatus = await this.getOfflineDbStatus(service.entityLabel)
    if (entityStatus.item == offLineDbStatus.notInitialized || entityStatus.item == null) {
      const refreshStatus = () => { OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus()) }
      const entitiesNumber = await new RebaseEntity(this.localDb, refreshStatus).synchronizes(service, (data) => {
        this.publishMessage(`synchronized ${data} items for  ${service.entityLabel}`)
        this.publishMessage(`sincronizzati ${entityStatus} items per ${service.entityLabel}`)

      })
    }
    else if (entityStatus.item == 1) {
      service.publish(service.initializeItems(await this.localDb.fetchAllRawItems4Entity(service.entityLabel)))

    }


  }

}
