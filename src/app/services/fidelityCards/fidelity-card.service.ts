import { Injectable, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { ItemServiceInterface } from '../../modules/item/models/ItemServiceInterface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FidelityCardModel } from '../../models/fidelityCardModel';
import { ItemModelInterface } from '../../modules/item/models/itemModelInterface';
import { OfflineItemServiceInterface } from '../../modules/offline/models/offlineItemServiceInterface';
import { offLineDbStatus } from '../../modules/offline/models/offlineDbStatus';
import { RawItem } from '../../modules/offline/models/rawItem';
import { OfflineDbService } from '../../modules/offline/services/offline-db.service';
import { OfflineManagerService } from '../../modules/offline/services/offline-manager.service';
import { ChangesService } from '../../modules/offline/services/changes.service';
import { Items2Update } from '../../modules/offline/models/items2Update';
import { CreateEntityOffline } from '../../modules/offline/business/createEntityOffline';
import { OperationKey } from '../../modules/offline/models/operationKey';
import { UpdateEntityOffline } from '../../modules/offline/business/updateEntityOffline';
import { DeleteEntityOffline } from '../../modules/offline/business/deleteEntityOffline';
import { OfflineDeleteOperation } from '../../modules/offline/business/offlineDeleteOperation';
import { OfflineUpdateOperation } from '../../modules/offline/business/offlineUpdateOperation';
import { OfflineCreateOperation } from '../../modules/offline/business/offlineCreateOperation';
import { OfflineItemModelInterface } from '../../modules/offline/models/offlineItemModelInterface';

@Injectable({
  providedIn: 'root'
})
export class FidelityCardService implements OfflineItemServiceInterface {

  static fidelityCardsListRef: firebase.default.database.Reference;
  _items: BehaviorSubject<Array<FidelityCardModel>> = new BehaviorSubject([])
  readonly items: Observable<Array<FidelityCardModel>> = this._items.asObservable()
  items_list: Array<FidelityCardModel> = []

  constructor(public localDb: OfflineDbService, public manager: OfflineManagerService, public changes: ChangesService) {
    this.setHref()

    this.manager.isLoggedUserOflineEnabled().then(offlineEnabled => {
      if (offlineEnabled) {
        manager.registerService(this)
      }
      else {
        this.loadFromFirebase()
      }
    })


  }

  publish: (items: ItemModelInterface[]) => void = (items: FidelityCardModel[]) => {
    this._items.next(items)
  };
  fetchItemsFromCloud: (callback: (items: {}[]) => void) => void = (callback) => {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.fidelityCardsListRef = firebase.default.database().ref(`/fidelityCards/${user.uid}/`)
        this.fidelityCardsListRef.once('value', items => {
          const rawItems: RawItem[] = []
          items.forEach(snap => {
            rawItems.push({ item: snap.val(), key: snap.key })
          })
          callback(rawItems)
        })
      }
    })
  }
  initializeItems: (items: {}[]) => ItemModelInterface[] = (raw_items: RawItem[]) => {
    const fornitori: FidelityCardModel[] = [];
    raw_items.forEach(item => {
      const card = new FidelityCardModel(item.item)
      card.setKey(item.key)
      fornitori.push(card)
    })

    return fornitori
  }


  async loadItemFromLocalDb() {
    return this.initializeItems(await this.localDb.fetchAllRawItems4Entity(this.entityLabel))
  }


  get entityLabel() {
    return new FidelityCardModel().entityLabel
  }
  offlineDbStatus: offLineDbStatus;
  setHref() {

    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.fidelityCardsListRef = firebase.default.database().ref(`/fidelityCards/${user.uid}/`)
        FidelityCardService.fidelityCardsListRef = firebase.default.database().ref(`/fidelityCards/${user.uid}/`)
      }
    }
    )

  }

  async loadFromFirebase() {

    this.publish(this.initializeItems(await this.localDb.fetchAllRawItems4Entity(this.entityLabel)))
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
  fidelityCardsListRef?: any;
  getItem(key: string): firebase.default.database.Reference {
    return this.fidelityCardsListRef.child(key)
  }
  async updateItem(item: ItemModelInterface) {
    
    const enabled = await this.manager.isLoggedUserOflineEnabled()
    const signature = await this.manager.asyncSignature()
    const fc = new FidelityCardModel().initialize(item)
    await new OfflineUpdateOperation(fc,this.changes,this.localDb,signature,enabled,this).runOperations()
    return this.fidelityCardsListRef.child(item.key).update(item.serialize())
  }
  async deleteItem(key: string) {
    const dummyCard = new FidelityCardModel()
    dummyCard.setKey(key)
    const enabled = await this.manager.isLoggedUserOflineEnabled()
    const signature = await this.manager.asyncSignature()
    await new OfflineDeleteOperation(signature,dummyCard,this.localDb,this.changes,enabled,this).runOperations()

    return this.fidelityCardsListRef.child(key).remove()
  }

  getDummyItem(): OfflineItemModelInterface {
    return new FidelityCardModel()
  }

  async createItem(item: ItemModelInterface) {

    var fc = new FidelityCardModel().initialize(item)
   
    const enabled = await this.manager.isLoggedUserOflineEnabled()
    const signature = await this.manager.asyncSignature()
    fc = new FidelityCardModel().initialize( await new OfflineCreateOperation(fc,this.changes,signature,this.localDb,enabled,this).runOperations())
    await this.fidelityCardsListRef.push(fc.serialize())
    return new FidelityCardModel().initialize(fc);
  }
  getEntitiesList(): firebase.default.database.Reference {
    return this.fidelityCardsListRef
  }
}
