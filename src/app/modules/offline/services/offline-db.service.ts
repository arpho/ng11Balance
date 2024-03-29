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

  DELETE_ALL() {
    return localforage.clear();
  }

  listKeys() {
    return localforage.keys();
  }

  fetchAllRawItems4Entity(entityLabel: string) {/**
   * fetch all items of label
    @param label 
   */
    const out: RawItem[] = []
    localforage.iterate((value, key, iterationNumber) => {
      if (value["entityLabel"] === entityLabel) {
        out.push(new RawItem({ item: value, key: key }))
      }
    })
    return out;
  }

}
