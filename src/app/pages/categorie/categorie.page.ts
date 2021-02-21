// tslint:disable:semicolon
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories/categorie.service';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { SelectorQuestion } from 'src/app/modules/dynamic-form/models/question-selector';
import {DetailCategoryPage} from '../detail-category/detail-category.page'

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.page.html',
  styleUrls: ['./categorie.page.scss'],
})
export class CategoriePage implements OnInit {
  public CategoriesList: Array<CategoryModel>;
  public filterLabel = 'Categorie';
  public filterString: string;
  public editModalPage = DetailCategoryPage
  filterFields: any;
  public filterFunction: (item: ItemModelInterface) => boolean;

  constructor(public categories: CategoriesService) {
    this.filterFields = [
      new TextboxQuestion({
        key: 'title',
        label: 'Filtra per categoria',
        filterFunction: (value: string, category: CategoryModel) => category.title.toUpperCase().includes(value.toUpperCase()),
        order: 1
      }),
      new SelectorQuestion({
        key: 'father',
        label: 'categoria origine',
        text: ' categoria origine',
        service: this.categories,
        createPopup:'',
        // filterFunction: (value: CategoryModel, category: CategoryModel) => value.father ? value.father.key === category.key : false,
        required: false
      }),
    ];
  }


  setFilter(ev: (item: ItemModelInterface) => boolean) {
    this.filterFunction = ev
  }

  searchFunctionFactory(v): (item: ItemModelInterface) => boolean {
    const out = (item: ItemModelInterface) => item.title.toLowerCase().indexOf(v.data.toLowerCase()) !== -1;
    return out;
  }

  ngOnInit() {
  }


}
