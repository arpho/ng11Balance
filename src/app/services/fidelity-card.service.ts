import { Injectable, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { ItemServiceInterface } from '../modules/item/models/ItemServiceInterface';
import { BehaviorSubject, Observable } from 'rxjs';
import { FidelityCardModel } from '../models/fidelityCardModel';
import { ItemModelInterface } from '../modules/item/models/itemModelInterface';
import { OfflineItemServiceInterface } from '../modules/offline/models/offlineItemServiceInterface';
import { offLineDbStatus } from '../modules/offline/models/offlineDbStatus';

@Injectable({
  providedIn: 'root'
})
export class FidelityCardService implements OfflineItemServiceInterface {

  public fidelityCardsListRef: firebase.default.database.Reference;
  _items: BehaviorSubject<Array<FidelityCardModel>> = new BehaviorSubject([])
  readonly items: Observable<Array<FidelityCardModel>> = this._items.asObservable()
  items_list: Array<FidelityCardModel> = []

  constructor() {


    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.fidelityCardsListRef = firebase.default.database().ref(`/fidelityCards/${user.uid}/`)
        this.fetchItems()

      }
    })
  }
  
  publish: (items: ItemModelInterface[]) => void;
  fetchItemsFromCloud: (callback: (items: {}[]) => void) => void;
  initializeItems: (items: {}[]) => ItemModelInterface[];
  loadItemFromLocalDb(): Promise<ItemModelInterface[]> {
    throw new Error('Method not implemented.');
  }


 get  entityLabel(){
    return  new FidelityCardModel().entityLabel
  }
  offlineDbStatus: offLineDbStatus;
  setHref() {
    throw new Error('Method not implemented.');
  }
  fetchItems() {
    this.fidelityCardsListRef.on('value', snapshot => {
      this.items_list = []
      snapshot.forEach(snap => {
        this.items_list.push(new FidelityCardModel(snap.val()))
      })
      this._items.next(this.items_list)

    })
  }

  categoriesService?: ItemServiceInterface;
  suppliersService?: ItemServiceInterface;
  paymentsService?: ItemServiceInterface;
  suppliersListRef?: any;
  getItem(key: string): firebase.default.database.Reference {
    return this.fidelityCardsListRef.child(key)
  }
  updateItem(item: ItemModelInterface) {
    return this.fidelityCardsListRef.child(item.key).update(item.serialize())
  }
  deleteItem(key: string) {
    return this.fidelityCardsListRef.child(key).remove()
  }
  getDummyItem(): ItemModelInterface {
    return new FidelityCardModel()
  }
  async createItem(item: ItemModelInterface) {
    var FidelityCard
    const category = await this.fidelityCardsListRef.push(item.serialize())
    category.on('value', (cat) => {
      FidelityCard = new FidelityCardModel(cat.val())
      FidelityCard.key = cat.key
      this.updateItem(FidelityCard)
    })
    return FidelityCard;
  }
  getEntitiesList(): firebase.default.database.Reference {
    return this.fidelityCardsListRef
  }
}
