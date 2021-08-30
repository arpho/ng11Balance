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

  constructor(public localDb:OfflineDbService) {
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
  publish: (items: ItemModelInterface[]) => void;
  fetchItemsFromCloud: (callback: (items: {}[]) => void) => void;
  initializeItems =   (raw_items: RawItem[]) =>{
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
  entityLabel = 'Pagamenti'
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

    var Payment

    const payment= await this.paymentsListRef.push(item.serialize());
    payment.on('value',pay=>{
      Payment = new PaymentsModel().initialize(pay.val())

      Payment.key  = pay.key

      this.updateItem(Payment)

    })
    return Payment


  }

  updateItem(item: ItemModelInterface) {
    return this.paymentsListRef.child(item.key).update(item.serialize());
  }
  
  deleteItem(key: string) {
    return this.paymentsListRef.child(key).remove();
  }
}
