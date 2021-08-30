import { Injectable } from '@angular/core';
import { ItemServiceInterface } from '../../modules/item/models/ItemServiceInterface';
import * as firebase from 'firebase/app';
import { ItemModelInterface } from '../../modules/item/models/itemModelInterface';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { Observable, BehaviorSubject } from 'rxjs';
import { EntityWidgetServiceInterface } from 'src/app/modules/widget/models/EntityWidgetServiceInterface';
import { PricedCategory } from 'src/app/models/pricedCategory';
import { PurchaseModel } from 'src/app/models/purchasesModel';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';
import { values } from 'd3';
import { ComponentsPageModule } from 'src/app/modules/item/components/components.module';
import { OfflineItemServiceInterface } from 'src/app/modules/offline/models/offlineItemServiceInterface';
import { RawItem } from 'src/app/modules/offline/models/rawItem';
import { offLineDbStatus } from 'src/app/modules/offline/models/offlineDbStatus';
import { OfflineDbService } from 'src/app/modules/offline/services/offline-db.service';
import { OfflineManagerService } from 'src/app/modules/offline/services/offline-manager.service';
import { UsersService } from 'src/app/modules/user/services/users.service';
import { OperationKey } from 'src/app/modules/offline/models/operationKey';
import { offline } from 'src/app/modules/offline/models/offlineDecorator';
import { ChangesService } from 'src/app/modules/offline/services/changes.service';
import { Items2Update } from 'src/app/modules/offline/models/items2Update';
import { CreateEntityOffline } from 'src/app/modules/offline/business/createEntityOffline';
import { UpdateEntityOffline } from 'src/app/modules/offline/business/updateEntityOffline';
import { OfflineItemModelInterface } from 'src/app/modules/offline/models/offlineItemModelInterface';
import { DeleteEntityOffline } from 'src/app/modules/offline/business/deleteEntityOffline';






@Injectable({
  providedIn: 'root'
})

export class CategoriesService implements OfflineItemServiceInterface, EntityWidgetServiceInterface {
  public readonly key = 'categories'
  public categoriesListRef: firebase.default.database.Reference;
  static categoriesListRef: firebase.default.database.Reference;
  _items: BehaviorSubject<Array<CategoryModel>> = new BehaviorSubject([])
  readonly items: Observable<Array<CategoryModel>> = this._items.asObservable()
  items_list: Array<CategoryModel> = []



  initializeCategory(cat) {


    var Cat = new CategoryModel(cat.key).initialize(cat)
    if (Cat.fatherKey) {
      this.getItem(Cat.fatherKey).on('value', father => { // in this case it is not posible use fetchItem
        const FatherCategory = this.initializeCategory(father.val())
        if (FatherCategory) {
          FatherCategory.key = father && father.key ? father.key : FatherCategory.key
          Cat.father = FatherCategory
        }

      })
    }

    return Cat
  }

  fetchItem(key: string, next) {
    this.items.subscribe((items: CategoryModel[]) => {
      const Item = items.filter((item: CategoryModel) => item && item.key == key)[0]
      next(Item)

    })
  }


  counterWidget = (entityKey: string, entities: ShoppingKartModel[]) => {
    return this.blowCategoriesUp(entities).filter((item: PricedCategory) => item.category.key == entityKey).map((item: PricedCategory) => 1).reduce((pv, cv) => { return pv += cv }, 0)
  }
  adderWidget = (entityKey: string, entities: ShoppingKartModel[]) => {
    return this.blowCategoriesUp(entities).filter((item: PricedCategory) => item.category.key == entityKey).map((item: PricedCategory) => item.price).reduce((pv, cv) => { return pv += cv }, 0);
  }
  filterableField = 'purchaseDate' // we filter shoppingkart's entities by purchase date
  get entityLabel() {
    return this.getDummyItem().entityLabel
  }


  categoriesService?: ItemServiceInterface;
  suppliersService?: ItemServiceInterface;
  paymentsService?: ItemServiceInterface;
  suppliersListRef?: any;

  setHref() {

    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.categoriesListRef = firebase.default.database().ref(`/categorie/${user.uid}/`)
        CategoriesService.categoriesListRef = firebase.default.database().ref(`/categorie/${user.uid}/`)
        console.log('set href', this.categoriesListRef)
      }
    }
    )

  }


  getDummyItem() {

    return new CategoryModel();
  }



  /**mappa ad ogni ogetto {categorie:CategoriModel[],price:number} con [{category:CategoryModel,price:number}]  */
  blowupCategories = (item: { categorie: CategoryModel[], price: number }) => item.categorie.map((cat: CategoryModel) => {
    return new PricedCategory({ category: cat, price: item.price })
  })

  /**
  * trasforma una lista di carrelli in una lista di items
  */
  ItemskartMapper2 = (pv: PurchaseModel[], cv: ShoppingKartModel) => [...pv, ...cv.items]



  itemsMapper2 = (item: PurchaseModel) => {
    /**
     * 
     */
    return { categorie: item.categorie, price: item.prezzo }
  }
  flattener = (pv, cv) => {
    return [...pv, ...cv]
  }

  blowCategoriesUp = (karts: ShoppingKartModel[]) => {
    return karts.reduce(this.ItemskartMapper2, []).map(this.itemsMapper2).map(this.blowupCategories).reduce(this.flattener, [])
  }






  getItem(prId: string): firebase.default.database.Reference {
    return this.categoriesListRef?.child(prId);
  }

  async updateItem(item: OfflineItemModelInterface) {
    await new UpdateEntityOffline(item, this.localDb).execute(navigator.onLine)
    const updatedCategory = new Items2Update(item,OperationKey.update)
    this.changes.createItem(updatedCategory)
    return this.categoriesListRef?.child(item.key).update(item.serialize());
  }
  async deleteItem(key: string) {
    await new DeleteEntityOffline(key, this.localDb, this.entityLabel).execute(navigator.onLine)
    await this.changes.createItem(new Items2Update(new CategoryModel().setKey(key), OperationKey.delete))
    return this.categoriesListRef?.child(key).remove();
  }



  constructor(public manager: OfflineManagerService, public users: UsersService, public localDb: OfflineDbService, public changes: ChangesService) {
    this.setHref()

    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.categoriesListRef = firebase.default.database().ref(`/categorie/${user.uid}/`)
      }
    }
    )

    this.users.loggedUser.subscribe(user => {

      if (user.isOfflineEnabled()) {
        console.log('users is offline enabled')
        this.manager.registerService(this)
      }
      else {
        console.log('user is not offline enabled, loading from cloud')
        this.fetchItemsFromCloud((items) => {
          console.log('got from firebase')
          this.publish(this.initializeItems(items))
        })
      }
    })




  }


  async createItem(item: CategoryModel) {
    item.key = `${this.entityLabel}_${new Date().getTime()}`

    var Category
    console.log('cat ref', this.categoriesListRef)
    const category = await CategoriesService.categoriesListRef.push(item.serialize()).then(res => {
      console.log('result', res.key, res, item)
      this.changes.createItem(new Items2Update(item, OperationKey.create))
      Category = new CategoryModel().initialize(item)
      console.log('created', Category)
    })
    await new CreateEntityOffline(item, this.localDb).execute(navigator.onLine)
    return Category;

  }

  async loadItemFromLocalDb() {
    console.log('loading item from local')
    return this.initializeItems(await this.localDb.fetchAllRawItems4Entity(this.entityLabel))
  }
  offlineDbStatus: offLineDbStatus;
  setOfflineStatus(value: offLineDbStatus) {

    /**just for testing */
    this.offlineDbStatus = value
    return this
  }
  localStatus: offLineDbStatus;
  publish = (items: CategoryModel[]) => {
    this._items.next(items)
  };


  getManager() {
    return this.manager
  }


  fetchItemsFromCloud(callback) {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.categoriesListRef = firebase.default.database().ref(`/categorie/${user.uid}/`)
        this.categoriesListRef.once('value', items => {
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
    const notNestedCategories: CategoryModel[] = [];
    raw_items.forEach(item => { //first step initialize flat categories
      notNestedCategories.push(new CategoryModel().initialize(item.item).setKey(item.key))
    })
    const categories = notNestedCategories.map(category => this.setFather(category, notNestedCategories))
    return categories
  }

  static initializeItems = (raw_items: RawItem[]) => {
    const notNestedCategories: CategoryModel[] = [];
    raw_items.forEach(item => { //first step initialize flat categories
      const cat = new CategoryModel().initialize(item.item).setKey(item.key)
      notNestedCategories.push(cat)
    })
    const categories = notNestedCategories.map(category => CategoriesService.setFather(category, notNestedCategories))
    return categories
  }
  setFather(category: CategoryModel, categoriesList: CategoryModel[]) {
    if (category && category.fatherKey) {
      const father = this.setFather(categoriesList.filter((f: CategoryModel) => f.key == category.fatherKey)[0], categoriesList)

      category.father = father
    }
    return category

  }

  static setFather(category: CategoryModel, categoriesList: CategoryModel[]) {
    if (category && category.fatherKey) {
      const father = this.setFather(categoriesList.filter((f: CategoryModel) => f.key == category.fatherKey)[0], categoriesList)

      category.father = father
    }
    return category

  }

  instatiateItem = (args: {}) => {
    return this.initializeCategory(args)
  }

}
