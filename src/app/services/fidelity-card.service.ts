import { Injectable, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { ItemServiceInterface } from '../modules/item/models/ItemServiceInterface';
import { BehaviorSubject, Observable } from 'rxjs';
import { FidelityCardModel } from '../models/fidelityCardModel';
import { ItemModelInterface } from '../modules/item/models/itemModelInterface';

@Injectable({
  providedIn: 'root'
})
export class FidelityCardService implements ItemServiceInterface {

  public fidelityCardsListRef: firebase.database.Reference;
  _items: BehaviorSubject<Array<FidelityCardModel>> = new BehaviorSubject([])
  readonly items: Observable<Array<FidelityCardModel>> = this._items.asObservable()
  items_list: Array<FidelityCardModel> = []

  constructor() {


    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.fidelityCardsListRef = firebase.database().ref(`/fidelityCards/${user.uid}/`)
        this.fetchItems()

      }
    })
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
  getItem(key: string): firebase.database.Reference {
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
  getEntitiesList(): firebase.database.Reference {
    return this.fidelityCardsListRef
  }
}
