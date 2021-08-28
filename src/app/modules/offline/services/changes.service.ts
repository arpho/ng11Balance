import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Items2Update } from '../models/items2Update';
import * as firebase from 'firebase/app';
import { RawItem } from '../models/rawItem';
import { ItemModelInterface } from '../../item/models/itemModelInterface';

@Injectable({
  providedIn: 'root'
})
export class ChangesService {
  public changesListRef: firebase.default.database.Reference;
  static changesListRef: firebase.default.database.Reference;

  _items: BehaviorSubject<Array<Items2Update>> = new BehaviorSubject([])
  readonly items: Observable<Array<Items2Update>> = this._items.asObservable()
  items_list: Array<Items2Update> = []


  constructor() {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.changesListRef = firebase.default.database().ref(`/changes/${user.uid}/`)
        ChangesService.changesListRef =  firebase.default.database().ref(`/changes/${user.uid}/`)
      }
    }
    )
   }


   getItem(prId: string): firebase.default.database.Reference {
    return this.changesListRef?.child(prId);
  }
 
  deleteItem(key: string) {
    return this.changesListRef?.child(key).remove();
  }

  static async createItem(item: Items2Update) {
  return   this.changesListRef.push(item.serialize()).on('value', (cat) => {

    })
    

  }


   fetchItemsFromCloud(callback) {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.changesListRef = firebase.default.database().ref(`/changes/${user.uid}/`)
        this.changesListRef.once('value', items => {
          const rawItems: RawItem[] = []
          items.forEach(snap => {
            rawItems.push({ item: snap.val(), key: snap.key })
          })
          callback(rawItems)
        })
      }
    })
  }

 static  updateItem(item: Items2Update) {
    return ChangesService.changesListRef?.child(item.key).update(item.serialize());
  }

  initializeItems = (raw_items: RawItem[]) => {
    var items:Items2Update[]
    this.changesListRef.on('value',(changes)=>{
      items= []
      changes.forEach(item=>{
        
        items.push(new Items2Update().initialize(item.val()).setKey(item.key))
      })
    })
    return items
  }
}
