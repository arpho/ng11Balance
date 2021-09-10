import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Items2Update } from '../models/items2Update';
import * as firebase from 'firebase/app';
import { RawItem } from '../models/rawItem';
import { ItemModelInterface } from '../../item/models/itemModelInterface';
import { OfflineManagerService } from './offline-manager.service';

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
    if (firebase.default.apps.length != 0) {
      firebase.default.auth().onAuthStateChanged(user => {
        if (user) {
          this.changesListRef = firebase.default.database().ref(`/changes/${user.uid}/`)
          this.fetchItemsFromCloud(items => {
            const changes = this.initializeItems(items)
            this._items.next(changes)
          })
        }
      }
      )
    }
  }


  getItem(prId: string): firebase.default.database.Reference {
    return this.changesListRef?.child(prId);
  }

  deleteItem(key: string) {
    return this.changesListRef?.child(key).remove();
  }

  async createItem(item: Items2Update) {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.changesListRef = firebase.default.database().ref(`/changes/${user.uid}/`)
        this.changesListRef.push(item.serialize())
      }
    }
    )

    return

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

  static updateItem(updatedItem: Items2Update) {
    return ChangesService.changesListRef?.child(updatedItem.key).update(updatedItem.serialize());
  }

  updateItem(updatedItem: Items2Update) {
    return ChangesService.changesListRef?.child(updatedItem.key).update(updatedItem.serialize());
  }


  initializeItems = (raw_items: RawItem[]) => {
    var items: Items2Update[] = []

    raw_items.forEach(item => {
      const change = new Items2Update(item.item['owner'], item.item['item'], item.item['operation']).setKey(item.key).setEntityLabel2Update(item.item['entity'])
      const entity = JSON.parse(item.item['item'])
      change.item = entity
      items.push(change) //changes to Be defined from offlineManager

    })
    return items
  }
}
