
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
import { Items2BeSynced } from 'src/app/modules/offline/models/items2BeSynced';
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
import { ExtendedShoppingKartModel } from 'src/app/models/extendedShoppingKart';
// tslint:disable:semicolon

@Injectable({
  providedIn: 'root'
})
export class ShoppingKartsService implements OfflineItemServiceInterface {
  public shoppingKartsListRef: firebase.default.database.Reference;
  static shoppingKartsListRef: firebase.default.database.Reference;
  _items: BehaviorSubject<Array<ExtendedShoppingKartModel>> = new BehaviorSubject([])
  readonly items: Observable<Array<ExtendedShoppingKartModel>> = this._items.asObservable()
  items_list: Array<ExtendedShoppingKartModel> = []
  categoriesService?: CategoriesService;

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

  async getItem(key: string): Promise<ShoppingKartModel>{
   
         return await this.manager.isLoggedUserOflineEnabled()? 
     this.getItemOffline(key):
     this.getItemOnLine(key)
    
    
  }
  async getItemOnLine(key: string): Promise<ExtendedShoppingKartModel> {
    const rawKart =  (await this.shoppingKartsListRef.child(key).once('value')).val()
    const kart = new ExtendedShoppingKartModel(rawKart)
    return kart
  }
  getItemOffline(key: string): Promise<ExtendedShoppingKartModel> {
    throw new Error('Method not implemented.');
  }

  get entityLabel() {
    const dummy = new ShoppingKartModel()
    return dummy.entityLabel
  }



  async updateItem(item: ItemModelInterface) {
    const enabled = await this.manager.isLoggedUserOflineEnabled()
    const signature = await this.manager.asyncSignature()
    const kart = new ShoppingKartModel().initialize(item)
    await new OfflineUpdateOperation(kart, this.changes, this.localDb, signature, enabled, this).runOperations()
    return this.shoppingKartsListRef.child(item.key).update(item.serialize());
  }

  async deleteItem(key: string) {
    console.log("deleting item", key)
    const enabled = await this.manager.isLoggedUserOflineEnabled()
    const signature = await this.manager.getSignature()
    console.log("signature", signature)
    const dummy = new ShoppingKartModel().setKey(key)
    await new OfflineDeleteOperation(signature, dummy, this.localDb, this.changes, enabled, this).runOperations()
    return this.shoppingKartsListRef.child(key).remove();
  }

  getDummyItem(): OfflineItemModelInterface {
    return new ShoppingKartModel()
  }

  async createItem(item: ItemModelInterface) {
    console.log("creatind kart", item)
    var kart = this.getDummyItem().initialize(item)
    console.log("initialized kart", kart)
    const enabled = await this.manager.isLoggedUserOflineEnabled()
    const signature = await this.manager.getSignature()
    console.log("signature 4 creatingItem", signature)
    const result = await this.shoppingKartsListRef.push(kart.serialize())
    this.changes.items['key'] = result.key
    kart = await new OfflineCreateOperation(kart, this.changes, signature, this.localDb, enabled, this).runOperations()
    console.log("operations executed", kart, kart.serialize())
    console.log("kart", kart)
    return kart;
  }


  publish: (items: ItemModelInterface[]) => void = async (items: ExtendedShoppingKartModel[]) => {
    const signature = await this.manager.asyncSignature()
    console.log("got signature",signature)
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

  async initializeSingleKart(snap) {


    const purchaseInitializer = async (purchase2initialize) => {

      const Purchase = new PurchaseModel().initialize(purchase2initialize)

      const initiateCategory = async (catKey2Beinitialized) => {

        let Category = new CategoryModel(catKey2Beinitialized)

        if (catKey2Beinitialized != '') {
         Category = await this.categoriesService.getItem(catKey2Beinitialized,)
        }
        return Category
      }
      const promisesList  = Purchase.categorieId ?  Purchase.categorieId.map( async(item)=> {return  initiateCategory(item)}) : []
      Purchase.categorie = await  Promise.all(promisesList) // converts Promise<CategoryMosel>[] to CategoryModel[]

      return Purchase
    }
    const kart = new ExtendedShoppingKartModel({ data: snap.val(),paymentsService:this.payments }).initialize(snap.val())

    kart.key = snap.key

    kart.items = kart.items?.map(purchaseInitializer)

    return kart
  }



  initializeSingleKartFromRawItem(item: RawItem) {


    const purchaseInitializer = (purchase2initialize) => {

      const Purchase = new PurchaseModel().initialize(purchase2initialize)

      const initiateCategory = (catKey2Beinitialized: string) => {

        var Category = new CategoryModel(catKey2Beinitialized)

        if (catKey2Beinitialized != '') {
          this.categoriesService.getItem(catKey2Beinitialized,(cat:CategoryModel)=>{
            Category = cat
          })

        
        }
        return Category
      }
      Purchase.categorie = Purchase.categorieId ? Purchase.categorieId.map(initiateCategory) : []

      return Purchase
    }
    const kart = new ExtendedShoppingKartModel({data:item.item,paymentsService:this.payments}).initialize(item.item)

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
        let Category = new CategoryModel(catKey2Beinitialized)
        if (catKey2Beinitialized != '') {
          this.categoriesService.getItem(catKey2Beinitialized,(cat:CategoryModel)=>{
            Category= cat
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
