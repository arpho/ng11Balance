import { Injectable } from '@angular/core';
import { JSONSchema } from '@ngx-pwa/local-storage';
import { PersistenceService } from './persistence.service';
import { FetchItems } from '../business/fetchItems'

@Injectable({
  providedIn: 'root'
})
export class OfflineDbServiceService {
  
  public categoriesListRef: firebase.database.Reference;


  fetchItems: FetchItems
  constructor(public persistence: PersistenceService) {

    this.fetchItems = new FetchItems(this.persistence)

  }

  fetchItem(key: string, schema?: JSONSchema) {

    return this.persistence.getItem(key, schema)
  }


  setItem(key: string, data: any, entityKey:string, schema?: JSONSchema) {

    return this.persistence.setItem(key, data, entityKey, schema)
  }



  deleteItem(key: string) {

    return this.persistence.deleteItem(key)
  }

  async fetchAllItems(entityKey: string, cb?) {

    return this.fetchItems.FetchAllItems(entityKey, cb)
  }

  async fetchAllItems2(entityKey: string, cb?) {
    console.log('fetchall items 2')
    this.persistence.fetchItems(entityKey, (items) => {
      console.log('in the end items',items)
    })
  }
}
