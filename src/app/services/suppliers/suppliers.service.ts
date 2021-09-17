import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { SupplierModel } from '../../models/supplierModel';
import { ItemServiceInterface } from '../../modules/item/models/ItemServiceInterface';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityWidgetServiceInterface } from 'src/app/modules/widget/models/EntityWidgetServiceInterface';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';
import { entries } from 'd3';
import { OfflineItemServiceInterface } from 'src/app/modules/offline/models/offlineItemServiceInterface';
import { offLineDbStatus } from 'src/app/modules/offline/models/offlineDbStatus';
import { RawItem } from 'src/app/modules/offline/models/rawItem';
import { OfflineDbService } from 'src/app/modules/offline/services/offline-db.service';
import { OfflineManagerService } from 'src/app/modules/offline/services/offline-manager.service';
import { OperationKey } from 'src/app/modules/offline/models/operationKey';
import { Items2Update } from 'src/app/modules/offline/models/items2Update';
import { ChangesService } from 'src/app/modules/offline/services/changes.service';
import { CreateEntityOffline } from 'src/app/modules/offline/business/createEntityOffline';
import { UpdateEntityOffline } from 'src/app/modules/offline/business/updateEntityOffline';
import { DeleteEntityOffline } from 'src/app/modules/offline/business/deleteEntityOffline';
import { OfflineCreateOperation } from 'src/app/modules/offline/business/offlineCreateOperation';
import { OfflineUpdateOperation } from 'src/app/modules/offline/business/offlineUpdateOperation';
import { OfflineDeleteOperation } from 'src/app/modules/offline/business/offlineDeleteOperation';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService implements OfflineItemServiceInterface, EntityWidgetServiceInterface {
  static suppliersListRef: firebase.default.database.Reference;
  public suppliersListRef: firebase.default.database.Reference;
  _items: BehaviorSubject<Array<SupplierModel>> = new BehaviorSubject([])
  readonly items: Observable<Array<SupplierModel>> = this._items.asObservable()
  items_list: Array<SupplierModel> = []

  constructor(public localDb: OfflineDbService, public manager: OfflineManagerService, public changes: ChangesService) {

    this.counterWidget = (entityKey: string, entities: ShoppingKartModel[]) => {
      return entities.map((item: ShoppingKartModel) => {

        return (item.fornitoreId == entityKey) ? 1 : 0
      }).reduce((pv, cv) => { return pv += cv }, 0)
    }
    this.adderWidget = (entityKey: string, entities: ShoppingKartModel[]) => {
      return entities.map((item: ShoppingKartModel) => {

        return (item.fornitoreId == entityKey) ? item.totale : 0
      }).reduce((pv, cv) => { return pv += cv }, 0)
    }
    this.instatiateItem = (args: {}) => {
      return new SupplierModel().initialize(args)
    }

    this.manager.isLoggedUserOflineEnabled().then(offlineEnabled => {
      if (offlineEnabled) {
        manager.registerService(this)
      }
      else {
        this.loadFromFirebase()
      }
    })


  }

  setHref() {

    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.suppliersListRef = firebase.default.database().ref(`/fornitori/${user.uid}/`)
        SuppliersService.suppliersListRef = firebase.default.database().ref(`/fornitori/${user.uid}/`)
        console.log('set href', this.suppliersListRef)
      }
    }
    )

  }

  publish: (items: ItemModelInterface[]) => void = (items: SupplierModel[]) => {
    this._items.next(items)
  };
  fetchItemsFromCloud: (callback: (items: {}[]) => void) => void = (callback) => {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.suppliersListRef = firebase.default.database().ref(`/fornitori/${user.uid}/`)
        this.suppliersListRef.once('value', items => {
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
    const fornitori: SupplierModel[] = [];
    raw_items.forEach(item => {
      fornitori.push(new SupplierModel().initialize(item.item).setKey(item.key))
    })

    return fornitori
  }
  async loadItemFromLocalDb() {
    return this.initializeItems(await this.localDb.fetchAllRawItems4Entity(this.entityLabel))
  }
  offlineDbStatus: offLineDbStatus;

  instatiateItem: (args: {}) => ItemModelInterface = (item: {}) => {
    return new SupplierModel().initialize(item)
  }
  key = 'suppliers';
  get entityLabel() {
    return this.getDummyItem().entityLabel
  }
  counterWidget: (entityKey: string, entities: ItemModelInterface[]) => number;
  adderWidget: (entityKey: string, entities: ItemModelInterface[]) => number;
  categoriesService?: ItemServiceInterface;
  suppliersService?: ItemServiceInterface;
  paymentsService?: ItemServiceInterface;


  getDummyItem() {

    return new SupplierModel();
  }

  async createItem(item: ItemModelInterface) {
    const Supplier = await new OfflineCreateOperation(new SupplierModel().
      initialize(item),
      this.changes,
      await this.manager.asyncSignature(),
      this.localDb, await this.manager.isLoggedUserOflineEnabled()).runOperations()
    await this.suppliersListRef.push(Supplier.serialize())
    return Supplier
  }

  getItem(prId: string): firebase.default.database.Reference {

    return (this.suppliersListRef && prId) ? this.suppliersListRef.child(prId) : undefined;
  }

  async loadFromFirebase() {

    this.publish(this.initializeItems(await this.localDb.fetchAllRawItems4Entity(this.entityLabel)))
  }

  async updateItem(item: SupplierModel) {
    const enabled = await this.manager.isLoggedUserOflineEnabled()
    const signature = await this.manager.asyncSignature()
    const Supplier = await new OfflineUpdateOperation(item, this.changes, this.localDb, signature, enabled).runOperations()
    return this.suppliersListRef.child(Supplier.key).update(Supplier.serialize());
  }
  async deleteItem(key: string) {
    const enabled = await this.manager.isLoggedUserOflineEnabled()
    const signature = await this.manager.asyncSignature()
    await new OfflineDeleteOperation(signature, new SupplierModel().setKey(key), this.localDb, this.changes, enabled).runOperations()
    return (key) ? this.suppliersListRef.child(key).remove() : undefined;
  }

}
