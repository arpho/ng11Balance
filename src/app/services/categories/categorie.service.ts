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
// @offlineWrapper
@Injectable({
  providedIn: 'root'
})
export class CategoriesService implements ItemServiceInterface, EntityWidgetServiceInterface {
  public readonly key = 'categories'
  public categoriesListRef: firebase.default.database.Reference;
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


  counterWidget: (entityKey: string, entities: ItemModelInterface[]) => number;
  adderWidget: (entityKey: string, entities: ItemModelInterface[]) => number;
  filterableField = 'purchaseDate' // we filter shoppingkart's entities by purchase date
  entityLabel = "Categoria";


  categoriesService?: ItemServiceInterface;
  suppliersService?: ItemServiceInterface;
  paymentsService?: ItemServiceInterface;
  suppliersListRef?: any;


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
    return karts.reduce(this.ItemskartMapper2, []).map(this.itemsMapper2).map(this.blowupCategories).reduce(this.flattener,[])
  }


  async createItem(item: CategoryModel) {
    var Category
    const category = await this.categoriesListRef.push(item.serialize()).on('value', (cat) => {
      console.log('created', cat.key, cat.val())
      Category = this.initializeCategory(cat.val())
      console.log('initialized', Category)
      Category.key = cat.key
    })
    return Category;

  }


  getItem(prId: string): firebase.default.database.Reference {
    return this.categoriesListRef.child(prId);
  }

  updateItem(item: ItemModelInterface) {
    return this.categoriesListRef.child(item.key).update(item.serialize());
  }
  deleteItem(key: string) {
    return this.categoriesListRef.child(key).remove();
  }

  constructor() {
    this.instatiateItem = (args: {}) => {
      return this.initializeCategory(args)
    }
    this.counterWidget = (entityKey: string, entities: ShoppingKartModel[]) => {
      return this.blowCategoriesUp(entities).filter((item: PricedCategory) => item.category.key == entityKey).map((item: PricedCategory) => 1).reduce((pv, cv) => { return pv += cv }, 0)
    }
    this.adderWidget = (entityKey: string, entities: ShoppingKartModel[]) => {
      return this.blowCategoriesUp(entities).filter((item: PricedCategory) => item.category.key == entityKey).map((item: PricedCategory) => item.price).reduce((pv, cv) => { return pv += cv }, 0);
    }
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.categoriesListRef = firebase.default.database().ref(`/categorie/${user.uid}/`);
        const notHierarchicalCategories: CategoryModel[] = [] // first load cathegories before father is loaded
        this.categoriesListRef.on('value', eventCategoriesListSnapshot => {
          this.items_list = [];
          eventCategoriesListSnapshot.forEach(snap => {
            notHierarchicalCategories.push(new CategoryModel(snap.key).initialize(snap.val()).setKey(snap.key))
          }
          );
          // now we load father
          notHierarchicalCategories.forEach(category => {
            const Category = this.setFather(category, notHierarchicalCategories)
            this.items_list.push(Category)
          })
          this._items.next(this.items_list)
        });
      }
    });


  }
  setFather(category: CategoryModel, categoriesList: CategoryModel[]) {
    if (category && category.fatherKey) {
      const father = this.setFather(categoriesList.filter((f: CategoryModel) => f.key == category.fatherKey)[0], categoriesList)

      category.father = father
    }
    return category

  }
  instatiateItem: (args: {}) => ItemModelInterface;

}
