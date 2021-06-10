// tslint:disable:semicolon
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CategoriesService } from 'src/app/services/categories/categorie.service';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
// import { CodegenComponentFactoryResolver } from '@angular/core/src/linker/component_factory_resolver';
import { ComponentsPageModule } from 'src/app/modules/item/components/components.module';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators'
// import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';

@Component({
  selector: 'app-categories-selector-page',
  templateUrl: './categories-selector.page.html',
  styleUrls: ['./categories-selector.page.scss'],
})
export class CategoriesSelectorPage implements OnInit {
  categoriesList: Array<CategoryModel>
  selectedCategoriesList: Array<CategoryModel>
  categoryIcon = 'add'
  selectedCategoryIcon = 'remove'
  colorSelectableCategory = 'green' // add category green
  colorSelectedCategory = 'orange'
  filterString: string
  searchbar: any
  searchControl: FormControl
  baseFilter: (item: CategoryModel) => boolean
  filterFunction: (item: CategoryModel) => boolean
  sorterFunction = (a: ItemModelInterface, b: ItemModelInterface) => (a.title < b.title ? -1 : (a.title > b.title ? 1 : 0))
  handleInput(event) {
    const query = event.target.value.toLowerCase();
    /*requestAnimationFrame(() => {
      items.forEach(item => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });*/
  }


  constructor(public modalCtrl: ModalController, public service: CategoriesService, public navParams: NavParams) {
    this.searchControl = new FormControl()
  }
  filterFactory(args: { selectedCategoriesList: Array<CategoryModel> }) {
    return (a: ItemModelInterface) => {
      if (!a) {
        a = new CategoryModel()
        a.key = ''
      }
      return !args.selectedCategoriesList.map((cat: ItemModelInterface) => cat.key
      ).includes(a.key)
    }
  }

  onKeydown(event) {
    console.log('enter',event);
  }

  onInput(ev) {

    console.log('input',ev.detail.value)
    this.filterFunction = this.makeFilter(ev.detail.value)
    this.filterString = ev.detail.value // spaghetti code waiting to be refactored
  }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.handleInput(search)
    })
    this.selectedCategoriesList = this.navParams.get('categories') || []
    this.filterFunction = this.filterFactory({ selectedCategoriesList: this.selectedCategoriesList })
    this.baseFilter = this.filterFactory({ selectedCategoriesList: this.selectedCategoriesList })
    if (this.service && this.service.items) {
      this.service.items.subscribe(items => { this.categoriesList = items })
    }

  }

  makeFilter(pattern: string) {
    return (item: CategoryModel) =>
      item ? this.baseFilter(item) && String(item.getTitle().value).toLowerCase().includes(pattern.toLowerCase()) : false


  }

  createCategory() {
    const newCategory = new CategoryModel().build({ title: this.filterString, key: '', service: this.service })
    this.service.createItem(newCategory).then(category => {
      console.log('created', category)

      newCategory.key = category.key
      this.selectedCategoriesList = [...this.selectedCategoriesList, newCategory]
    })
  }

  removeCategory(category: CategoryModel) {
    this.selectedCategoriesList = this.selectedCategoriesList.filter((item: CategoryModel) => item.key !== category.key)
    this.filterFunction = (a: ItemModelInterface) => this.selectedCategoriesList.map((item: ItemModelInterface) => item.key).includes(a.key)
    this.filterFunction = this.filterFactory({ selectedCategoriesList: this.selectedCategoriesList })
  }
  hasCat(cat2BeChecked: CategoryModel) {
    return this.selectedCategoriesList.some((cat: CategoryModel) => cat.key == cat2BeChecked.key)
  }
  includesCategories(newCat: CategoryModel[]) {/**
   * add only the categories not already dselected
   */
    const categoriesList = [...this.selectedCategoriesList]
    newCat.forEach(cat => {
      if (!this.hasCat(cat)) {
        categoriesList.push(cat)
      }

    })
    return categoriesList

  }
  addCategory(cat: CategoryModel) {
    // TODO this.searchControl.reset()
    this.selectedCategoriesList = this.includesCategories(cat.addCategory())
    this.filterFunction = this.filterFactory({ selectedCategoriesList: this.selectedCategoriesList })

  }

  dismiss(data?) {
    this.modalCtrl.dismiss(data)
  }

}
