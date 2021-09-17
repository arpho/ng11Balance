
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
import { Items2Update } from 'src/app/modules/offline/models/items2Update';
import { OperationKey } from 'src/app/modules/offline/models/operationKey';
import { CreateEntityOffline } from 'src/app/modules/offline/business/createEntityOffline';
import { ChangesService } from 'src/app/modules/offline/services/changes.service';
import { UpdateEntityOffline } from 'src/app/modules/offline/business/updateEntityOffline';
import { DeleteEntityOffline } from 'src/app/modules/offline/business/deleteEntityOffline';
import { OfflineUpdateOperation } from 'src/app/modules/offline/business/offlineUpdateOperation';
import { OfflineDeleteOperation } from 'src/app/modules/offline/business/offlineDeleteOperation';
import { OfflineCreateOperation } from 'src/app/modules/offline/business/offlineCreateOperation';
import { OfflineItemModelInterface } from 'src/app/modules/offline/models/offlineItemModelInterface';
import { DateModel } from 'src/app/modules/user/models/birthDateModel';
// tslint:disable:semicolon

@Injectable({
  providedIn: 'root'
})
export class ShoppingKartsService implements OfflineItemServiceInterface {
  public shoppingKartsListRef: firebase.default.database.Reference;
  static shoppingKartsListRef: firebase.default.database.Reference;
  _items: BehaviorSubject<Array<ShoppingKartModel>> = new BehaviorSubject([])
  readonly items: Observable<Array<ShoppingKartModel>> = this._items.asObservable()
  items_list: Array<ShoppingKartModel> = []
  categoriesService?: ItemServiceInterface;

  constructor(categories: CategoriesService,
    public payments: PaymentsService,
    public suppliers: SuppliersService,
    public localDb: OfflineDbService,
    public manager: OfflineManagerService,
    public changes: ChangesService) {

    this.categoriesService = categories
    this.manager.isLoggedUserOflineEnabled().then(offlineEnabled => {
      if (offlineEnabled) {
        manager.registerService(this)
      }
      else {
        this.loadFromFirebase()
      }
    })




  }


  async loadFromFirebase() {

    this.publish(this.initializeItems(await this.localDb.fetchAllRawItems4Entity(this.entityLabel)))
  }

  getItem(key: string): firebase.default.database.Reference {
    return this.shoppingKartsListRef.child(key);
  }

  get entityLabel() {
    const dummy = new ShoppingKartModel()
    return dummy.entityLabel
  }



  async updateItem(item: ItemModelInterface) {
    
    const enabled = await this.manager.isLoggedUserOflineEnabled()
    const signature = await this.manager.asyncSignature()
    const kart = new ShoppingKartModel().initialize(item)
    await new OfflineUpdateOperation(kart,this.changes,this.localDb,signature,enabled).runOperations()
    return this.shoppingKartsListRef.child(item.key).update(item.serialize());
  }

  async deleteItem(key: string) {
    const enabled = await this.manager.isLoggedUserOflineEnabled()
    const signature = await this.manager.asyncSignature()
    const dummy = new ShoppingKartModel().setKey(key)
    await new OfflineDeleteOperation(signature,dummy,this.localDb,this.changes,enabled).runOperations()
    return this.shoppingKartsListRef.child(key).remove();
  }

  getDummyItem(): OfflineItemModelInterface {
    return new ShoppingKartModel()
  }
  
  async createItem(item: ItemModelInterface) {
    const enabled = await this.manager.isLoggedUserOflineEnabled()
    if (enabled) {
      console.log('creating kart offline')
      item.key = `${this.entityLabel}_${new Date().getTime()}`
      var Kart = new ShoppingKartModel().initialize(item).setKey(item.key)
      await new OfflineCreateOperation(Kart, this.changes, await this.manager.asyncSignature(), this.localDb).execute()
      this.shoppingKartsListRef.push(item.serialize())
    }
    else {
      console.log('creating kart only online')
      const result = await this.shoppingKartsListRef.push(item.serialize())
      Kart.setKey(result.key)
    }
    return Kart;
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



  initializeSingleKartFromRawItem(item: RawItem) {


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
    this.suppliers.items.subscribe(suppliers => {
      const sup = suppliers.filter(supplier => supplier.key == kart.fornitoreId)[0]
      kart.setSupplier(sup)
    })
    this.payments.items.subscribe(payments => {
      const pay = payments.filter(payment => payment.key == kart.pagamentoId)[0]
      kart.setPayment(pay)

    })
    kart.purchaseDate = new DateModel(kart.dataAcquisto)

    return kart
  }





  // initialize all the karts
  initializeItems(items: RawItem[]) {
    const karts: Array<ShoppingKartModel> = []

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


    items.forEach(item => {
      const kart = this.initializeSingleKartFromRawItem(item)
      karts.push(kart)
    })
    return karts
  }
}
