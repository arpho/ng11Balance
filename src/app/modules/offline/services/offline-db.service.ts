import { Injectable } from '@angular/core';
import * as localforage   from 'localforage';
import { RawItem } from '../models/rawItem';

@Injectable({
  providedIn: 'root'
})
export class OfflineDbService {

  constructor() {
    localforage.config({
      storeName: 'BalanceOfflineDb'
    })
  }


  get(key: string) {
    return localforage.getItem(key);
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

  async fetchAllRawItems4Entity(entityLabel: string) {/**
   * fetch all items of label
    @param label 
   */
  console.log('loading',entityLabel)
    const out: RawItem[] = []
   await  localforage.iterate((value, key, iterationNumber) => {
      console.log('iterating',value,key)
      const rawitem = new RawItem({ item: value, key: key })
      if (value["entityLabel"] === entityLabel) {
        out.push(rawitem)
      }
    })
    return out;
  }

}
