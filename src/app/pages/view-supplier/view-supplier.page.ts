
// tslint:disable: semicolon
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { SupplierModel } from 'src/app/models/supplierModel';
import { CreateSupplierPage } from '../create-supplier/create-supplier.page';
import { SuppliersService } from 'src/app/services/suppliers/suppliers.service';
import { GeoService } from 'src/app/modules/geo-location/services/geo-service';
import { Router } from '@angular/router';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { SwitchQuestion } from 'src/app/modules/dynamic-form/models/question-switch';
import { GeoLocateQuestion } from 'src/app/modules/dynamic-form/models/question-geolocate';
import { Coordinates } from 'src/app/modules/geo-location/models/coordinates';
import { ItemServiceInterface } from 'src/app/modules/item/models/ItemServiceInterface';
import { CategoriesService } from 'src/app/services/categories/categorie.service';
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.page.html',
  styleUrls: ['./view-supplier.page.scss'],
})
export class ViewSupplierPage implements OnInit {
  supplier: SupplierModel
  supplierFields: any
  showSpinner = false

  constructor(
    public suppliers:SuppliersService,
    public modalCtrl: ModalController,
    navParams: NavParams
  ) {
    // super(suppliers, geo, router, modalCtrl)
    this.supplier = navParams.get('item')
    this.supplierFields = [
      new TextboxQuestion({
        key: 'title',
        label: 'Nome del Fornitore',
        value: (this.supplier) ? this.supplier.title : '',
        order: 1
      }),
      new TextAreaBox({
        key: 'note',
        label: 'note',
        value: (this.supplier) ? this.supplier.note : '',
        order: 2
      }),
      new SwitchQuestion({
        key: 'ecommerce',
        label: 'venditore online',
        labelTrue: 'venditore fa ecommerce',
        labelFalse: ' venditore tradizionale',
        value: (this.supplier) ? this.supplier.ecommerce : false,
        iconTrue: 'wifi',
        iconFalse: 'cash',
        required: false,
        order: 4
      }),
      new SwitchQuestion({
        key: 'cliente',
        label: 'cliente/fornitore',
        labelTrue: 'cliente',
        labelFalse: ' fornitore',
        iconTrue: 'happy',
        iconFalse: 'hammer',
        value: this.supplier ? this.supplier.cliente : false,
        required: false,
        order: 5
      }),
      new SwitchQuestion({
        key: 'personaFisica',
        label: 'persona',
        labelTrue: 'fisica',
        labelFalse: ' fiscale',
        value: this.supplier ? this.supplier.personaFisica : false,
        iconTrue: 'man',
        iconFalse: 'business',
        required: false,
        order: 6
      }),
      new GeoLocateQuestion({
        key: 'address',
        label: 'indirizzo',
        required: false,
        value: (this.supplier) ? this.supplier.address : new Coordinates(),
        order: 7

      })
    ]

  }

  ngOnInit() {
  }


  filter(sup) {
  }
  submit(sup) {
    this.showSpinner = true

    this.supplier.build(sup)
    this.suppliers.updateItem(this.supplier).then(v => {
      this.showSpinner = false
      this.dismiss()
    })
  }

  dismiss() {
    this.modalCtrl.dismiss()
  }

}
