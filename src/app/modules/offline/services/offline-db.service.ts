import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { LastLoggedUidFetcher } from '../business/LastLoggedUidFetcher';
import { RawItem } from '../models/rawItem';
import { createRxDatabase,RxCollection,RxDatabase,RxSchema } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { BehaviorSubject, lastValueFrom, Observable, take } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OfflineDbService {
  //public db: RxDatabase // to be compatible with localForageMocker
  _db:BehaviorSubject<RxDatabase>=new BehaviorSubject(null)
  readonly db:Observable<RxDatabase>=this._db.asObservable()
  setDb(db:RxDatabase){
    this._db.next(db)
  }

   getDb(){
    return lastValueFrom(this.db.pipe(take(2)))
  }


  constructor() {
    localforage.config({
      storeName: 'BalanceOfflineDb'
    })
  }

  iterate(callback: (value: unknown, key: string) => void) { //to be compatible with localForageMocker
    for (const [key, value] of Object.entries(this.db)) {

      callback(value, key)
    }
  }


  async get(key: string) {
    return new RawItem({ key, 'item': await localforage.getItem(key) });
  }

  set(key: string, value: any) {
    return localforage.setItem(key, value);
  }

  remove(key: string) {
    return localforage.removeItem(key);
  }

  clear() {
    return localforage.clear();
  }

  listKeys() {
    return localforage.keys();
  }

  async getLastLoggedUserId() {
    return new LastLoggedUidFetcher(this).execute()

  }
/**
 * 
 * @param dbname :string
 * @returns RxDatabase
 * @description create a new offline db
 */
  async createOfflineDb(dbname:string){
    console.log("creating ##@ db",dbname)
    //this.db=await 
   return  createRxDatabase({
      name:dbname,
      storage:getRxStorageDexie()
    })
    


  }

/**
 * 
 * @param db RxDatabase
 * @param schema RxSchema
 * @description create a new collection for db
 * @returns RxCollection the created collection
 */
  async createSchema4Db(schema:{}){
    const db = await this.getDb()
    console.log("creating schema##@",schema)
    let  rxschema: { [x: string]: RxCollection; } 
    await db.addCollections(schema).then((collection)=>{
      console.log("success creating schema##@",collection)
      rxschema= collection
      console.log("##@ db",this.db)
    }).catch(err=>{
    console.log("error##@",err)
  })
  return rxschema
}
fetchAllDocuments4Collection(collection:RxCollection){
  return collection.find().exec()
}

  async fetchAllRawItems4Entity(entityLabel: string) {/**
   * fetch all items of label
    @param label 
   */
    const out: RawItem[] = []
    await localforage.iterate((value, key, iterationNumber) => {
      const rawitem = new RawItem({ item: value, key: key })
      if (value["entityLabel"] === entityLabel) {
        out.push(rawitem)
      }
    })
    return out;
  }

}
