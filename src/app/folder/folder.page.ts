import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShoppingKartModel } from '../models/shoppingKartModel';
import { ItemModelInterface } from '../modules/item/models/itemModelInterface';
import { CreateShoppingKartPage } from '../pages/create-shopping-kart/create-shopping-kart.page';
import { DetailShoppingKartPage } from '../pages/detail-shopping-kart/detail-shopping-kart.page';
import { ShoppingKartsService } from '../services/shoppingKarts/shopping-karts.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  ItemsList: ItemModelInterface[];
  filterLabel: string;
  filterString: string;
  secondSpinner: boolean;

  createModalPage= CreateShoppingKartPage
  public editModalPage= DetailShoppingKartPage
  filterFields: any;
  compareDate = (a: Date, b: Date) => a > b ? -1 : a < b ? 1 : 0
  filterFunction: (item: ItemModelInterface) => boolean;
  sorterFunction: (a: ItemModelInterface, b: ItemModelInterface) => number =
    (a: ShoppingKartModel, b: ShoppingKartModel) => {
      // tslint:disable: semicolon
      const dateA = a.purchaseDate.getFullDate()
      const dateB = b.purchaseDate.getFullDate()
      return this.compareDate(dateA, dateB)
    }

  constructor(private activatedRoute: ActivatedRoute,public service: ShoppingKartsService) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');

    this.secondSpinner = true
    this.ItemsList = [];
    this.service.items.subscribe(items=>{
      this.ItemsList = items
      this.secondSpinner = false
    })
  }

}
