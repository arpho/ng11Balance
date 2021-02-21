// tslint:disable: semicolon
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoryModel } from 'src/app/models/CategoryModel';

@Component({
  selector: 'app-categories-viewer',
  templateUrl: './categories-viewer.component.html',
  styleUrls: ['./categories-viewer.component.scss'],
})
export class CategoriesViewerComponent implements OnInit {
  @Input() categorie: Array<CategoryModel>
  @Output() updatedCategories: EventEmitter<Array<CategoryModel>> = new EventEmitter()
  @Output() clickedCategory: EventEmitter<CategoryModel> = new EventEmitter()
  @Input() categoryIcon = 'pricetag'
  @Input() categoryColor = 'blue'

  constructor() { }

  ngOnInit() {
    this.categoryColor = this.categoryColor || 'blue'
    this.categoryIcon = this.categoryIcon || 'pricetag'
  }

  clicked(cat) {
    this.clickedCategory.emit(cat)
  }

}
