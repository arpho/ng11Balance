// tslint:disable: semicolon
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { SuppliersService } from 'src/app/services/suppliers/suppliers.service';
import { GeoService } from 'src/app/modules/geo-location/services/geo-service';
import { Router } from '@angular/router';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { SwitchQuestion } from 'src/app/modules/dynamic-form/models/question-switch';
import { ViewController } from '@ionic/core';
// import { filterQueryId } from '@angular/core/src/view/util';
import { GeoLocateQuestion } from 'src/app/modules/dynamic-form/models/question-geolocate';
import { SupplierModel } from 'src/app/models/supplierModel';
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.page.html',
  styleUrls: ['./create-supplier.page.scss'],
})
export class CreateSupplierPage implements OnInit {
  filterFields: any
  supplier: SupplierModel
  showSpinner = false

  filter(ev) {
  }

  submit(supplier) {

    this.showSpinner = true

    this.supplier = new SupplierModel(supplier)

    this.supplier.build(supplier)

    this.service.createItem(this.supplier).then(supplier => {

      this.dismiss(supplier)
    })
  }

  constructor(
    // public suppliers: SuppliersService,
    public geo: GeoService,

    public router: Router,

    public service: SuppliersService,

    public modalCtrl: ModalController) {

    this.supplier = new SupplierModel()

    this.filterFields = [

      new TextboxQuestion({
        key: 'title',

        label: 'Nome del Fornitore',

        value: this.supplier.title || this.supplier.nome,

        order: 1
      }),
      new TextAreaBox({
        autoGrow:true,

        key: 'note',

        label: 'note',

        value: this.supplier.note,

        order: 2
      }),
      new SwitchQuestion({
        key: 'ecommerce',

        label: 'venditore online',

        labelTrue: 'venditore fa ecommerce',

        labelFalse: ' venditore tradizionale',

        iconTrue: 'wifi',

        iconFalse: 'cash',

        value: this.supplier.onLine,

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
        value: this.supplier.cliente,
        required: false,
        order: 5
      }),
      new SwitchQuestion({
        key: 'personaFisica',
        label: 'persona',
        labelTrue: 'fisica',
        labelFalse: ' fiscale',
        value: this.supplier.personaFisica,
        iconTrue: 'man',
        iconFalse: 'business',
        required: false,
        order: 6
      }),
      new GeoLocateQuestion({
        // tslint:disable: quotemark
        key: "address",
        label: "indirizzo",
        required: false,
        order: 7

      })
    ];


  }

  dismiss(obj?) {
    this.modalCtrl.dismiss(obj)
  }


  ngOnInit() {
  }

}
