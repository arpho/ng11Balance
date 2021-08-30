import { Injectable } from '@angular/core';
import { ItemModelInterface } from '../../modules/item/models/itemModelInterface';
import { PaymentsModel } from 'src/app/models/paymentModel';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { EntityWidgetServiceInterface } from 'src/app/modules/widget/models/EntityWidgetServiceInterface';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';
import { OfflineItemServiceInterface } from 'src/app/modules/offline/models/offlineItemServiceInterface';
import { offLineDbStatus } from 'src/app/modules/offline/models/offlineDbStatus';
import { ItemServiceInterface } from 'src/app/modules/item/models/ItemServiceInterface';
import { RawItem } from 'src/app/modules/offline/models/rawItem';
import { OfflineDbService } from 'src/app/modules/offline/services/offline-db.service';
import { OfflineManagerService } from 'src/app/modules/offline/services/offline-manager.service';
import { CreateEntityOffline } from 'src/app/modules/offline/business/createEntityOffline';
import { ChangesService } from 'src/app/modules/offline/services/changes.service';
import { Items2Update } from 'src/app/modules/offline/models/items2Update';
import { OperationKey } from 'src/app/modules/offline/models/operationKey';
import { UpdateEntityOffline } from 'src/app/modules/offline/business/updateEntityOffline';
import { DeleteEntityOffline } from 'src/app/modules/offline/business/deleteEntityOffline';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService implements OfflineItemServiceInterface, EntityWidgetServiceInterface {

  public paymentsListRef: firebase.default.database.Reference;
  _items: BehaviorSubject<Array<PaymentsModel>> = new BehaviorSubject([])
  readonly items: Observable<Array<PaymentsModel>> = this._items.asObservable()
  items_list: Array<PaymentsModel> = []
  getDummyItem() {
    return new PaymentsModel();

  }

  constructor(public localDb: OfflineDbService, public manager: OfflineManagerService, public changes: ChangesService) {
    this.manager.registerService(this)
    this.counterWidget = (entityKey: string, entities: ShoppingKartModel[]) => {
      return entities.filter((item: ShoppingKartModel) => {
        return item.pagamentoId == entityKey
      }).map((item: ShoppingKartModel) => 1).reduce((pv: number, cv: number) => {
        return pv += cv
      }, 0)

    }
    this.adderWidget = (entityKey: string, entities: ShoppingKartModel[]) => {
      return entities.filter((item: ShoppingKartModel) => {
        return item.pagamentoId == entityKey
      }).map((item: ShoppingKartModel) => item.totale).reduce((pv: number, cv: number) => {
        return pv += cv
      }, 0)
    }
    this.instatiateItem = function (args: {}) {

      return new PaymentsModel().initialize(args)
    }

  }
  publish = (items: PaymentsModel[]) => {
    this._items.next(items)
  };
  fetchItemsFromCloud(callback) {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.paymentsListRef = firebase.default.database().ref(`/pagamenti/${user.uid}/`)
        this.paymentsListRef.once('value', items => {
          const rawItems: RawItem[] = []
          items.forEach(snap => {
            rawItems.push({ item: snap.val(), key: snap.key })
          })
          callback(rawItems)
        })
      }
    })
  }


  initializeItems = (raw_items: RawItem[]) => {
    const payments: PaymentsModel[] = [];
    raw_items.forEach(item => { //first step initialize flat categories
      payments.push(new PaymentsModel().initialize(item.item).setKey(item.key))
    })

    return payments
  }
  async loadItemFromLocalDb(): Promise<ItemModelInterface[]> {
    return this.initializeItems(await this.localDb.fetchAllRawItems4Entity(this.entityLabel))

  }
  offlineDbStatus: offLineDbStatus;
  setHref() {

    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.paymentsListRef = firebase.default.database().ref(`/pagamenti/${user.uid}/`);
      }
    })

  }
  instatiateItem: (args: {}) => any;




  ItemModelInterface: any;
  key = 'payments';
  get entityLabel() { return this.getDummyItem().entityLabel }
  filterableField: string;
  instantiateItem: (args: {}) => ItemModelInterface
  counterWidget: (entityKey: string, entities: ItemModelInterface[]) => number;
  adderWidget: (entityKey: string, entities: ItemModelInterface[]) => number;
  categoriesService?: ItemServiceInterface;
  suppliersService?: ItemServiceInterface;
  paymentsService?: ItemServiceInterface;
  suppliersListRef?: any;



  getItem(prId: string): firebase.default.database.Reference {
    return this.paymentsListRef.child(prId);
  }

  async createItem(item: ItemModelInterface) {
    item.key = `${this.entityLabel}_${new Date().getTime()}`
    var Payment

    await this.paymentsListRef.push(item.serialize());
    Payment = new PaymentsModel().initialize(item)
    const update = new Items2Update(Payment, OperationKey.create)
    await this.changes.createItem(update)
    await new CreateEntityOffline(Payment, this.localDb).execute(navigator.onLine)
    return Payment


  }

  async updateItem(item: ItemModelInterface) {
    await new UpdateEntityOffline(new PaymentsModel().initialize(item), this.localDb).execute(navigator.onLine)
    this.changes.createItem(new Items2Update(new PaymentsModel().initialize(item), OperationKey.update))
    return this.paymentsListRef.child(item.key).update(item.serialize());
  }

  async deleteItem(key: string) {
    await new DeleteEntityOffline(key, this.localDb, this.entityLabel).execute(navigator.onLine)
    await this.changes.createItem(new Items2Update(new PaymentsModel().setKey(key), OperationKey.delete))
    return this.paymentsListRef.child(key).remove();
  }
}
