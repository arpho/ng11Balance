
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';
import { SwitchQuestion } from 'src/app/modules/item/models/question-switch';
import { DateQuestion } from 'src/app/modules/dynamic-form/models/question-date';
import { SuppliersService } from 'src/app/services/suppliers/suppliers.service';
import { SupplierModel } from 'src/app/models/supplierModel';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import { PaymentsModel } from 'src/app/models/paymentModel';
import { DateModel } from 'src/app/modules/user/models/birthDateModel';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
import { GeoService } from 'src/app/modules/geo-location/services/geo-service';
import { CreatePurchasePage } from '../create-purchase/create-purchase.page';
import { PurchaseModel } from 'src/app/models/purchasesModel';
import { DetailPurchasePage } from '../detail-purchase/detail-purchase.page';
import { ShoppingKartsService } from 'src/app/services/shoppingKarts/shopping-karts.service';
import { SelectorQuestion } from 'src/app/modules/dynamic-form/models/question-selector';
import { FormGroup } from '@angular/forms';
import { CreateSupplierPage } from '../create-supplier/create-supplier.page';
import { CreatePaymentPage } from '../create-payment/create-payment.page'
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';
import { RoundPipe } from 'src/app/modules/utilities/pipes/round.pipe';
// tslint:disable: semicolon
@Component({
  selector: 'app-create-shopping-kart',
  templateUrl: './create-shopping-kart.page.html',
  styleUrls: ['./create-shopping-kart.page.scss'],
})
export class CreateShoppingKartPage implements OnInit {
  showSpinner = false
  public position = { latitude: 0, longitude: 0 };
  supplierFilterFunction: (item: ItemModelInterface) => boolean
  supplierSorterFunction: (a: ItemModelInterface, b: ItemModelInterface) => number
  kart: ShoppingKartModel
  kartFields: any
  Form: FormGroup
  title: string

  categoryColor = 'blue'
  categoryIcon = 'pricetag'
  textSelectSupplier = 'Fornitore'
  textSelectPayment = 'Pagamento'
  localPosition: { latitude: number, longitude: number }
  constructor(
    public supplierService: SuppliersService,
    public paymentsService: PaymentsService,
    public geo: GeoService,
    public rounderPipe: RoundPipe,
    public modalCtrl: ModalController,
    public service: ShoppingKartsService,
  ) {

    this.kart = new ShoppingKartModel()
    this.supplierSorterFunction = (a: SupplierModel, b: SupplierModel) => {
      return this.geo.distance(a.address.latitude, a.address.longitude, this.position.latitude, this.position.longitude) -
        this.geo.distance(b.address.latitude, b.address.longitude, this.position.latitude, this.position.longitude);
    }


  }

  setTotal(total: number) {
    this.kart.totale = Math.round(total * 100) / 100
    this.title = `nuovo carrello ${this.kart.moneta} ${this.rounderPipe.transform(this.kart.totale)} `
  }
  calculateTotal() {
    const reducer: (acc: number, curr: PurchaseModel) => number = (acc: number, curr: PurchaseModel) => {
      return (curr && curr.prezzo) ? acc + curr.prezzo : acc
    }
    return this.kart.items ? this.kart.items.reduce<number>(reducer, 0) : 0
  }

  async addPurchase() {
    const modal = await this.modalCtrl.create({ component: CreatePurchasePage })
    modal.onDidDismiss().then((purchase) => {
      const Purchase = purchase.data
      this.kart.addItem(Purchase)
      this.kart.totale = this.rounderPipe.transform(this.calculateTotal())
      this.title = `nuovo carrello: ${this.kart.moneta} ${this.kart.totale}`
    })
    return await modal.present()
  }

  setFormFields(kart: ShoppingKartModel, ItemsFilterFunction: (item: ItemModelInterface) => boolean, sorterFunction?) {
    console.log('setting kart', kart)
    return [
      new TextboxQuestion({
        key: 'title',
        label: 'titolo spesa',
        value: this.kart.title,
        order: 1
      }),
      new TextAreaBox({
        autoGrow: true,
        key: 'note',
        label: 'note',
        value: kart.note,
        order: 2
      }),
      new SwitchQuestion({
        key: 'ecommerce',
        label: 'modalità di acquisto',
        labelTrue: 'acquisto online',
        labelFalse: ' acquisto di persona',
        value: kart.online,
        required: false,
        order: 4
      }),
      new DateQuestion({
        key: 'dataAcquisto',
        // tslint:disable-next-line: quotemark
        label: "data di acquisto",
        value: kart.purchaseDate.formatDate(),
        required: true
      }),
      new SelectorQuestion({
        key: 'supplier',
        text: ' Fornitore',
        label: 'Fornitore',
        service: this.supplierService,
        ItemsFilterFunction,
        sorterFunction,
        value: kart.fornitore,
        required: true,
        createPopup: CreateSupplierPage
      }),
      new SelectorQuestion({
        key: 'payment',
        text: 'Pagamento',
        label: 'Pagamento',
        service: this.paymentsService,
        required: true,
        value: kart.pagamento,
        createPopup: CreatePaymentPage

      })
    ];
  }




  ngOnInit() {
    this.title = 'nuovo carrello  **'
    this.kart = new ShoppingKartModel()
    this.kartFields = this.setFormFields(this.kart, this.supplierFilterFunction) // kartFields must be initialized asap 
    this.geo.getPosition().then(coords => {
      if (coords) {
        this.localPosition = { latitude: coords.coords.latitude, longitude: coords.coords.longitude };
        this.supplierSorterFunction = (a: SupplierModel, b: SupplierModel) => {
          return this.geo.distance(a.address.latitude, a.address.longitude, this.localPosition.latitude, this.localPosition.longitude)
            - this.geo.distance(b.address.latitude, b.address.longitude, this.localPosition.latitude, this.localPosition.longitude)
        }
        this.kartFields = this.setFormFields(this.kart, this.supplierFilterFunction, this.supplierSorterFunction) // now supplierSorterFunction is defined
      }
    })
    this.supplierFilterFunction = (item: SupplierModel) => true // neutral filter

  }
  removeItem(item, slidingItem) {
    this.kart.removeItem(item)
    this.kart.totale = this.rounderPipe.transform(this.calculateTotal())
    this.title = `nuovo carrello: ${this.kart.moneta} ${this.kart.totale}`
  }

  async detailPurchase(purchase) {

    const modal = await this.modalCtrl.create({ component: DetailPurchasePage, componentProps: { purchase } })
    modal.onDidDismiss().then(data => {
      if (data.data) {
        this.kart.updateItem(data.data)
      }
    })
    return await modal.present()
  }

  async selectedSupplier(supplier: SupplierModel) {
    if (supplier && this.kart) {

      this.kart.setSupplier(supplier)
    }
  }

  selectedPayment(payment: PaymentsModel) {
    if (payment) {
      this.kart.setPayment(payment)

    }
  }

  setForm(form: FormGroup) {
    this.Form = form
    // tslint:disable-next-line: no-string-literal
    this.Form.controls['ecommerce'].valueChanges.subscribe(ev => {
      if (ev) {
        this.supplierFilterFunction = (item: SupplierModel) => {
          return item.ecommerce
        }
      } else {
        this.supplierFilterFunction = (item) => true
      }
      this.kartFields = this.setFormFields(this.kart, this.supplierFilterFunction)
    })
  }

  filter(ev) {
    Object.assign(this.kart, ev) // forse non è la cosa piú pulita da fare, ma funziona, da sistemarer se c'è tempo
    if (ev.supplier) {
      this.selectedSupplier(ev.supplier)
    }
    if (ev.payment) {
      this.selectedPayment(ev.payment)
    }
  }
  submit(ev) {
    this.showSpinner = true
    Object.assign(this.kart), ev
    this.kart.title = ev.title || this.kart.fornitore.getTitle().value

    this.kart.purchaseDate = new DateModel(new Date(ev.dataAcquisto))
    this.service.createItem(this.kart).then(res => {
      this.showSpinner = false
      this.dismiss()
    })
  }

  dismiss() {
    this.modalCtrl.dismiss()
  }

}
