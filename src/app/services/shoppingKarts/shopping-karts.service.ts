
import { Injectable } from '@angular/core';
// tslint:disable:semicolon
import { ItemServiceInterface } from '../../modules/item/models/ItemServiceInterface'
import { CategoriesService } from '../categories/categorie.service'
import { PaymentsService } from '../payments/payments.service'
import { SuppliersService } from '../suppliers/suppliers.service'
import * as firebase from 'firebase';
import { ItemModelInterface } from '../../modules/item/models/itemModelInterface';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierModel } from 'src/app/models/supplierModel';
import { PaymentsModel } from 'src/app/models/paymentModel';
import { PurchaseModel } from 'src/app/models/purchasesModel';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { PricedCategory } from 'src/app/models/pricedCategory';
//import { ConnectionServiceModule } from 'ng-connection-service';
// tslint:disable:semicolon

@Injectable({
  providedIn: 'root'
})
export class ShoppingKartsService implements ItemServiceInterface {
  public shoppingKartsListRef: firebase.default.database.Reference;
  _items: BehaviorSubject<Array<ShoppingKartModel>> = new BehaviorSubject([])
  readonly items: Observable<Array<ShoppingKartModel>> = this._items.asObservable()
  items_list: Array<ShoppingKartModel> = []
  categoriesService?: ItemServiceInterface;

  getItem(key: string): firebase.default.database.Reference {
    return this.shoppingKartsListRef.child(key);
  }



  updateItem(item: ItemModelInterface) {
    console.log('serialize in update',item.serialize())
    return this.shoppingKartsListRef.child(item.key).update(item.serialize());
  }
  deleteItem(key: string) {
    return this.shoppingKartsListRef.child(key).remove();
  }
  getDummyItem(): import('../../modules/item/models/itemModelInterface').ItemModelInterface {
    return new ShoppingKartModel()
  }
  async createItem(item: ItemModelInterface) {
    var Kart
    const kart = await this.shoppingKartsListRef.push(item.serialize())
    kart.on('value', value => {
      Kart = this.initializeSingleKart(value)

      this.updateItem(Kart) // add the key to the firebase's node
    })
    return Kart;
  }

  constructor(categories: CategoriesService, public payments: PaymentsService, public suppliers: SuppliersService) {

    this.categoriesService = categories

    this.initializeItems()

  }

  initializeSingleKart(snap) {

    const purchaseInitializer = (purchase2initialize) => {

      const Purchase = new PurchaseModel().initialize(purchase2initialize)

      const initiateCategory = (catKey2Beinirtialized) => {

        const Category = new CategoryModel(catKey2Beinirtialized)

        if (catKey2Beinirtialized != '') {

          this.categoriesService.getItem(catKey2Beinirtialized).on('value', (category) => {

            Category.initialize(category.val())
          })
        }
        return Category
      }
      Purchase.categorie = Purchase.categorieId ? Purchase.categorieId.map(initiateCategory) : []

      return Purchase
    }
    const kart = new ShoppingKartModel({ key: snap.val() }).initialize(snap.val())

    kart.key = snap.key

    kart.items = kart.items.map(purchaseInitializer)

    return kart
  }
  // initialize all the karts
  private initializeItems() {
    const purchaseInitializer = (purchase2initialize) => {
      const Purchase = new PurchaseModel().initialize(purchase2initialize)
      const initiateCategory = (catKey2Beinirtialized) => {
        const Category = new CategoryModel(catKey2Beinirtialized)
        if (catKey2Beinirtialized != '') {
          this.categoriesService.getItem(catKey2Beinirtialized).on('value', (category) => {
            Category.initialize(category.val())
          })
        }
        return Category
      }
      Purchase.categorie = Purchase.categorieId ? Purchase.categorieId.map(initiateCategory) : []
      return Purchase
    }
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.shoppingKartsListRef = firebase.default.database().ref(`/acquisti/${user.uid}/`);
        this.shoppingKartsListRef.on('value', eventSuppliersListSnapshot => {
          this.items_list = [];
          eventSuppliersListSnapshot.forEach(snap => {
            const kart = this.initializeSingleKart(snap)
            this.items_list.push(kart);
          });
          this._items.next(this.items_list)
        });
      }
    });
  }
}
