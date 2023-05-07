import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, take  } from 'rxjs';
import { UsersService } from '../../user/services/users.service';
import { CloneEntity } from '../business/cloneEntityFromFirebase';
import { StoreSignature } from '../business/storeSignatureOnLocalDb';
import { offLineDbStatus } from '../models/offlineDbStatus';
import { OfflineItemServiceInterface } from '../models/offlineItemServiceInterface';
import { ChangesService } from './changes.service';
import { OfflineDbService } from './offline-db.service';
import { of, pipe } from 'rxjs'
import { Items2BeSynced } from '../models/items2BeSynced';
import { pullChangesFromCloud } from '../business/pullFromCloud';
import { ConnectionStatusService } from './connection-status.service';
import { Push2Cloud } from '../business/push2Cloud';
import { Puller } from '../business/puller';
import { credentials } from 'src/app/configs/credentials';
import { RebaseEntity } from '../business/rebaseEntity';
import { UserModel } from '../../user/models/userModel';
import { isRxDatabase } from 'rxdb';
import firebase from "firebase/app";
import { configs } from 'src/app/configs/configs';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
  servicesList: Array<OfflineItemServiceInterface> = []
   staticLocalDb
   _offlineDbStatus: BehaviorSubject<offLineDbStatus> = new BehaviorSubject(0)
   offlineDbStatus: Observable<offLineDbStatus> = this._offlineDbStatus.asObservable()
  signature: string
  _msg: BehaviorSubject<string> = new BehaviorSubject('')
  readonly msg: Observable<string> = this._msg.asObservable()

  publishMessage(msg: string) {
    this._msg.next(msg)
  }


  createWorker() {

    if (typeof Worker !== 'undefined') {
      // Create a new
      console.log('ciao worker')
      // console.log('url',import.meta.url)
      /*new URL('offline-db.service',)
     const worker = new Worker('../webworker/offlineWebworker', {type:'module'});
     console.log('ciao webw',worker)
     worker.onmessage = ({ data }) => {
       console.log(`page got message: ${data}`);
     };
     worker.postMessage('hello');  */
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }

  }
  
  /**
   *@description controlla se esiste il db offline e se esiste lo sincronizza con il db online
   */
  async bootOfflineDb(){
      const signature = await this.getSignature()
        console.log("signature ##@",signature)
      const dbname = this.makeDbName(signature)
      console.log(!"##@ xcreating ",dbname)
      this.localDb.setDb( await this.localDb.createOfflineDb(dbname))
    

  }
  initializeFirebase(){
    if (firebase.apps.length === 0) {
      firebase.initializeApp(credentials.firebase);
   
 }
  }
  async init():Promise<boolean>{
    console.log('initializing firebase ##')
    this.initializeFirebase()
    console.log('initializing db ##')
    await this.bootOfflineDb()
    return true
  }

  constructor(public localDb: OfflineDbService,
    public users: UsersService,
    public changes: ChangesService,
    private toaster:ToastController,
    connection: ConnectionStatusService) {
      this.bootOfflineDb()
    if ( this.isDbPresent()) { //Db offline is present I can synchronize it
      this.createWorker()
      this.getSignature()

      this.pullChangesFromCloud()
      connection.monitor(async status => {
        console.log('monitor', status)
        if (status) {
          this.syncChanges()
        }
        else {
          console.log('we are offline')
          const lastLoggedUid = localDb.getLastLoggedUserId()
          console.log('last uid', lastLoggedUid)
          users.setLoggedUser(new UserModel({ key: lastLoggedUid }))

        }
      }

      )

    }
    else{
      console.log("we must create the db and download the data from firebase ##")
    }






    /**
     * signs he db and store the signature for future uses
     */
    this.makeSignature(async sign => {
       const user = lastValueFrom(this.users.loggedUser.pipe(take(2)))

      //await new StoreSignature(this.localDb, sign,user.uid).execute()
    })

  }
  makeDbName(signature: string){
    return `${configs.dbName}_${signature}`
  }

  async isDbPresent() {
    var is: boolean

  const signature = await this.getSignature()
    console.log("signature ##",signature)
  const dbname = this.makeDbName(signature)
  console.log("looking for db ##",dbname)
   is = isRxDatabase(dbname)
  console.log("is db present ##",is)
    return is
  }
  async syncChanges() {
    await this.pullChangesFromCloud()
    await this.push2Cloud()
    console.log('syncing changes')

  }
  async push2Cloud() {
    //new Push2Cloud(this.localDb, this.servicesList) TOBE refactored

  }

  refreshItems() {
    /** fetch all items from local db and publishes the items */
    this.servicesList.forEach(async service => {
      service.publish(service.initializeItems(await this.localDb.fetchAllRawItems4Entity(service.entityLabel)))
    })
  }

  async getSignature() {
    var signature = this.signature
    if (!this.signature) {
      signature =  await this.asyncSignature()
      this.signature = signature
    }
    return signature

  }


  async retrieveSignature(){


   
      const user = await lastValueFrom (this.users.loggedUser.pipe(take(2)))

     const signature = await new StoreSignature(this.localDb, await this.fetchSignature(user.uid),user.uid).execute()
     return signature
      
    
  }
 

  async pullChangesFromCloud() {
    const signature = await this.asyncSignature()
    const puller = new Puller(this.localDb, await this.getSignature(), this.servicesList, this.changes)
    this.changes.fetchItemsFromCloud(signature, changes => puller.// download changes
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
/**
 * @description recupera la firma dell'utente loggato, se non esiste la crea
 * @param uid 
 * @returns 
 */
  async fetchSignature(uid: string) {
    var sign = ''
    const signatures = await this.localDb.fetchAllRawItems4Entity("signatures")
    const o = signatures.filter(s => s.item['uid'] == uid)
    if (o.length == 0) {
      sign = String(new Date().getTime())
      new StoreSignature(this.localDb, sign, uid).execute()
    }
    else {
      sign = o[0].item["signature"]

    }
    return `${sign}`
  }
  /**
   *@description  e' un wrapper di fetchSignature setta signature
   * @param next 
   */
  makeSignature(next?) {

    this.users.loggedUser.subscribe(async user => {
      if (user.uid) {
        const signature =await this.fetchSignature(user.uid)
        this.signature = signature
                if(next){
        next(signature)}
      }
    })


  }

  async asyncSignature() {
    const user =  await lastValueFrom(this.users.loggedUser.pipe(take(2)))/**pipe e take servono 
    per far terminare lo Observable, altrimenti si otterrebbe un errore */
    return await this.fetchSignature( user.uid )
  }/**
   * 
   * @param back callback function che riceve la firma dell'utente loggato
   */
  getLoggedUserSignature(back:(signature:string)=>void){

    this.users.loggedUser.subscribe(async user=>{
      console.log("logged user",user.uid)
    
      const fSignature = await this.fetchSignature(user.uid)
      back(fSignature)

    })
  }





   evaluateDbStatus() {
    
    const statusList = this.servicesList.map((service: OfflineItemServiceInterface) => {
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

   async publishEntity(entity: string) {
    const service = this.servicesList.filter((service: OfflineItemServiceInterface) => service.entityLabel == entity)[0]
    service?.publish(await service.loadItemFromLocalDb())



  }

  async isLoggedUserOflineEnabled() {
    const user = await lastValueFrom(this.users.loggedUser.pipe(take(2)))
    return user.isOfflineEnabled()
  }

  async rebaseDb() {
    await this.push2Cloud() // upload not synched changes
    await this.localDb.clear()
    this.makeSignature(async sign => {
      const user = await  lastValueFrom(this.users.loggedUser.pipe(take(2)))
      await new StoreSignature(this.localDb, await sign, user.uid).execute()
    })
    const refreshStatus = () => { this._offlineDbStatus.next(this.evaluateDbStatus()) }
    const synchonizer = new RebaseEntity(this.localDb, refreshStatus)
    //clones entiites for every service
    this.servicesList.forEach(async service => {
      await synchonizer.synchronizes(service, (data) => {
        this.publishMessage(`synchronized ${data} items for  ${service.entityLabel}`)
      })


    })
  }
  async showToast(message: string,position:"top" | "bottom" | "middle"="top",duration=5000) {
    const toast = await this.toaster.create({
      message,
    duration,
    position})
    return toast
   
  }

  async registerService(service: OfflineItemServiceInterface) {
    console.log("registering service ##@",service.entityLabel)
    if (!this.servicesList.map(service => service.entityLabel).includes(service.entityLabel)) {
      this.servicesList.push(service)
      const collection = await this.localDb.createSchema4Db(service.getDummyItem().fetchSchema())
      console.log("collection ##@", collection)
      console.log("new collection ##@",collection[service.entityLabel])
      const documents = await this.localDb.fetchAllDocuments4Collection(collection[service.entityLabel])
      service.publish(documents)
      await this.localDb.insertDocumentsInCollection(collection[service.entityLabel],documents)
      this.showToast(`inseriti ${documents.length} documenti in ${service.entityLabel}`)
      console.log("documents ##@",documents)
      if(documents.length==0){
        console.log("must download documents ##@")
        
        service.fetchItemsFromCloud(items=>{
        
        const Items = service.initializeItems(items)
        console.log("##@ Items",Items)
        })
      }
      else{
        console.log("documents already exist in collection##@",service.entityLabel)
      }

      service.setHref()
      if (this.servicesList.length == configs.offlineEntityNumber) {
        console.log("ready to fetch items")
        await this.syncChanges()
      }
    }
    const entityStatus = await this.getOfflineDbStatus(service.entityLabel)
    if (entityStatus.item == offLineDbStatus.notInitialized || entityStatus.item == null) {
      const refreshStatus = () => { this._offlineDbStatus.next(this.evaluateDbStatus()) }
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
