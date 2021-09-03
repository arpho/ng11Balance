
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
import { OfflineItemServiceInterface } from 'src/app/modules/offline/models/offlineItemServiceInterface';
import { RawItem } from 'src/app/modules/offline/models/rawItem';
import { offLineDbStatus } from 'src/app/modules/offline/models/offlineDbStatus';
import { OfflineDbService } from 'src/app/modules/offline/services/offline-db.service';
import { OfflineManagerService } from 'src/app/modules/offline/services/offline-manager.service';
//import { ConnectionServiceModule } from 'ng-connection-service';
// tslint:disable:semicolon

@Injectable({
  providedIn: 'root'
})
export class ShoppingKartsService implements OfflineItemServiceInterface {
  public shoppingKartsListRef: firebase.default.database.Reference;
  static  shoppingKartsListRef: firebase.default.database.Reference;
  _items: BehaviorSubject<Array<ShoppingKartModel>> = new BehaviorSubject([])
  readonly items: Observable<Array<ShoppingKartModel>> = this._items.asObservable()
  items_list: Array<ShoppingKartModel> = []
  categoriesService?: ItemServiceInterface;

  getItem(key: string): firebase.default.database.Reference {
    return this.shoppingKartsListRef.child(key);
  }

  get entityLabel(){
    const dummy = new ShoppingKartModel()
    return dummy.entityLabel
  }



  updateItem(item: ItemModelInterface) {
    console.log('serialize in update',item.serialize())
    return this.shoppingKartsListRef.child(item.key).update(item.serialize());
  }
  deleteItem(key: string) {
    return this.shoppingKartsListRef.child(key).remove();
  }
  getDummyItem(): ItemModelInterface {
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

  constructor(categories: CategoriesService, public payments: PaymentsService, public suppliers: SuppliersService,public localDb:OfflineDbService,public manager:OfflineManagerService) {

    this.categoriesService = categories
    manager.registerService(this)

  

  }
  
  
  publish: (items: ItemModelInterface[]) => void = (items: ShoppingKartModel[]) => {
    this._items.next(items)
  };

  fetchItemsFromCloud: (callback: (items: {}[]) => void) => void = (callback) => {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.suppliersListRef = firebase.default.database().ref(`/acquisti/${user.uid}/`)
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


  async loadItemFromLocalDb(): Promise<ItemModelInterface[]> {
    return this.initializeItems(await this.localDb.fetchAllRawItems4Entity(this.entityLabel))
  }
  offlineDbStatus: offLineDbStatus;
  setHref() {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.shoppingKartsListRef = firebase.default.database().ref(`/acquisti/${user.uid}/`)
        ShoppingKartsService.shoppingKartsListRef = firebase.default.database().ref(`/acquisti/${user.uid}/`)
      }
    }
    )
  }
  suppliersService?: ItemServiceInterface;
  paymentsService?: ItemServiceInterface;
  suppliersListRef?: any;

  initializeSingleKart(snap) {
    

    const purchaseInitializer = (purchase2initialize) => {

      const Purchase = new PurchaseModel().initialize(purchase2initialize)

      const initiateCategory = (catKey2Beinirtialized) => {

        const Category = new CategoryModel(catKey2Beinirtialized)

        if (catKey2Beinirtialized != '') {

          this.categoriesService.getItem(catKey2Beinirtialized)?.on('value', (category) => {

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

    kart.items = kart.items?.map(purchaseInitializer)

    return kart
  }



  initializeSingleKartFromRawItem(item:RawItem) {
    

    const purchaseInitializer = (purchase2initialize) => {

      const Purchase = new PurchaseModel().initialize(purchase2initialize)

      const initiateCategory = (catKey2Beinirtialized) => {

        const Category = new CategoryModel(catKey2Beinirtialized)

        if (catKey2Beinirtialized != '') {

          this.categoriesService.getItem(catKey2Beinirtialized)?.on('value', (category) => {

            Category.initialize(category.val())
          })
        }
        return Category
      }
      Purchase.categorie = Purchase.categorieId ? Purchase.categorieId.map(initiateCategory) : []

      return Purchase
    }
    const kart = new ShoppingKartModel({ key: item.key }).initialize(item.item)

    kart.key = item.key

    kart.items = kart.items?.map(purchaseInitializer)

    return kart
  }





  // initialize all the karts
   initializeItems(items: RawItem[]) {
     const karts:Array<ShoppingKartModel>=[]

    const purchaseInitializer = (purchase2initialize) => {
      const Purchase = new PurchaseModel().initialize(purchase2initialize)
      const initiateCategory = (catKey2Beinitialized) => {
        const Category = new CategoryModel(catKey2Beinitialized)
        if (catKey2Beinitialized != '') {
          this.categoriesService.getItem(catKey2Beinitialized).on('value', (category) => {
            Category.initialize(category.val())
          })
        }
        return Category
      }
      Purchase.categorie = Purchase.categorieId ? Purchase.categorieId.map(initiateCategory) : []
      return Purchase
    }
    

    items.forEach(item=>{
      const kart =this.initializeSingleKartFromRawItem(item)
      karts.push(kart)
    })
    return karts
  }
}
