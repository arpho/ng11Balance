// tslint:disable:semicolon
import { Component, OnInit } from '@angular/core';
import { CreatePurchasePage } from '../create-purchase/create-purchase.page';
import { ModalController, NavParams } from '@ionic/angular';
import { TextboxQuestion } from 'src/app/modules/item/models/question-textbox';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';

@Component({
  selector: 'app-detail-purchase',
  templateUrl: '../create-purchase/create-purchase.page.html',
  styleUrls: ['./detail-purchase.page.scss'],
})
export class DetailPurchasePage extends CreatePurchasePage implements OnInit {

  constructor(public modalCtrl: ModalController, private navParams: NavParams) {
    super(modalCtrl)
  }

  ngOnInit() {

    this.purchase = this.navParams.get('purchase')
    this.title = this.purchase ? `modifica ${this.purchase.descrizione}` : 'modifica acquisto'
    this.purchaseFields = [
      new TextboxQuestion({
        key: 'descrizione',
        label: 'acquisto',
        value: this.purchase ? this.purchase.descrizione : '',
        order: 1
      }),
      new TextAreaBox({
        autoGrow: true,
        key: 'note',
        label: 'annotazioni',
        value: this.purchase ? this.purchase.note : '',
        order: 2
      }),
      new TextboxQuestion({
        key: 'prezzo',
        type: 'number',
        label: 'prezzo',
        value: this.purchase ? this.purchase.prezzo : 0
      })
    ];
  }

  setCategories(cats: Array<CategoryModel>) {
    this.purchase.categorie = cats
  }


  submit(purchase) {
    this.purchase.clone(purchase)
    this.dismiss(this.purchase)
  }
}
