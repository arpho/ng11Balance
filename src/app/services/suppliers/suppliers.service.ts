import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { SupplierModel } from '../../models/supplierModel';
import { ItemServiceInterface } from '../../modules/item/models/ItemServiceInterface';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityWidgetServiceInterface } from 'src/app/modules/widget/models/EntityWidgetServiceInterface';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';
import { entries } from 'd3';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService implements ItemServiceInterface, EntityWidgetServiceInterface {
  public suppliersListRef: firebase.default.database.Reference;
  _items: BehaviorSubject<Array<SupplierModel>> = new BehaviorSubject([])
  readonly items: Observable<Array<SupplierModel>> = this._items.asObservable()
  items_list: Array<SupplierModel> = []
  constructor() {
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
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.suppliersListRef = firebase.default.database().ref(`/fornitori/${user.uid}/`);
        this.suppliersListRef.on('value', eventSuppliersListSnapshot => {
          this.items_list = [];
          eventSuppliersListSnapshot.forEach(snap => {
            const supplier = new SupplierModel(undefined, snap.key).initialize(snap.val())
            supplier.key = snap.key // alcuni item non hanno il campo key
            this.items_list.push(supplier);
            if (supplier.key === '') {
            }
          });
          this._items.next(this.items_list)
        });
      }
    });
  }
  instatiateItem: (args: {}) => ItemModelInterface;
  key = 'suppliers';
  entityLabel = 'Fornitori'
  counterWidget: (entityKey: string, entities: ItemModelInterface[]) => number;
  adderWidget: (entityKey: string, entities: ItemModelInterface[]) => number;
  categoriesService?: ItemServiceInterface;
  suppliersService?: ItemServiceInterface;
  paymentsService?: ItemServiceInterface;


  getDummyItem() {

    return new SupplierModel();
  }

  async createItem(item: ItemModelInterface) {
    var Supplier
    const supplier = await this.suppliersListRef.push(item.serialize())

    supplier.on('value', sup => {

      Supplier = this.instatiateItem(sup.val())

      Supplier.key = sup.key

      this.updateItem(Supplier)

    })
    return Supplier
  }

  getItem(prId: string): firebase.default.database.Reference {

    return (this.suppliersListRef && prId) ? this.suppliersListRef.child(prId) : undefined;
  }

  updateItem(item: SupplierModel) {
    return this.suppliersListRef.child(item.key).update(item.serialize());
  }
  deleteItem(key: string) {

    return (key) ? this.suppliersListRef.child(key).remove() : undefined;
  }

}
