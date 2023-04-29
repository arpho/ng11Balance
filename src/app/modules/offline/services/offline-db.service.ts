import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { LastLoggedUidFetcher } from '../business/LastLoggedUidFetcher';
import { RawItem } from '../models/rawItem';
import { createRxDatabase,RxDatabase,RxSchema } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
@Injectable({
  providedIn: 'root'
})
export class OfflineDbService {
  public db: {} // to be compatible with localForageMocker


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
  createOfflineDb(dbname:string){
    return createRxDatabase({
      name:dbname,
      storage:getRxStorageDexie()
    })


  }

/**
 * 
 * @param db RxDatabase
 * @param schema RxSchema
 * @description create a new schema for db
 */
  createSchema4Db(db:RxDatabase,schema:RxSchema,collectionName:string){
    const newSchema
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
