// tslint:disable: semicolon
import { Component, OnInit, ɵConsole } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { GeoService } from 'src/app/modules/geo-location/services/geo-service';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import { SuppliersService } from 'src/app/services/suppliers/suppliers.service';
import { ShoppingKartsService } from 'src/app/services/shoppingKarts/shopping-karts.service';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';
import { SupplierModel } from 'src/app/models/supplierModel';
import { PaymentsModel } from 'src/app/models/paymentModel';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
import { SwitchQuestion } from 'src/app/modules/item/models/question-switch';
import { DateQuestion } from 'src/app/modules/dynamic-form/models/question-date';
import { TextboxQuestion } from 'src/app/modules/item/models/question-textbox';
import { ComponentsPageModule } from 'src/app/modules/item/components/components.module';
import { DetailPurchasePage } from '../detail-purchase/detail-purchase.page';
import { PurchaseModel } from 'src/app/models/purchasesModel';
import { DateModel } from 'src/app/modules/user/models/birthDateModel';
import { CreatePurchasePage } from '../create-purchase/create-purchase.page';
import { QuestionBase } from '../../modules/dynamic-form/models/question-base';
import { SelectorQuestion } from 'src/app/modules/dynamic-form/models/question-selector';
import { CreatePaymentPage } from '../create-payment/create-payment.page';
import { CreateSupplierPage } from '../create-supplier/create-supplier.page'
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';
import { RoundPipe } from 'src/app/modules/utilities/pipes/round.pipe';

@Component({
  selector: 'app-detail-shopping-kart',
  templateUrl: './detail-shopping-kart.page.html',
  styleUrls: ['./detail-shopping-kart.page.scss'],
})
export class DetailShoppingKartPage implements OnInit {
  showSpinner = false
  supplierFilterFunction: (item: ItemModelInterface) => boolean
  supplierSorterFunction: (a: ItemModelInterface, b: ItemModelInterface) => number
  kart: ShoppingKartModel
  kartFields: Array<any>
  textSelectSupplier = 'Fornitore'
  textSelectPayment = 'Pagamento'
  categoryIcon = 'eye'
  categoryColor = 'blue'
  position: { latitude: number, longitude: number }
  title: string

  constructor(
    public toastCtrl: ToastController,
    public supplierService: SuppliersService,
    public paymentsService: PaymentsService,
    public rounderPipe:RoundPipe,
    public geo: GeoService,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public service: ShoppingKartsService
  ) {

  }
  setKartFields() {
    this.kartFields = [
      new TextboxQuestion({
        key: 'title',
        label: 'titolo spesa',
        value: this.kart ? this.kart.title : '',
        order: 1
      }),
      new TextAreaBox({
        key: 'note',
        label: 'note',
        value: this.kart ? this.kart.note : '',
        autoGrow:true,
        order: 2
      }),
      new SwitchQuestion({
        key: 'ecommerce',
        label: 'modalità di acquisto',
        labelTrue: 'acquisto online',
        labelFalse: ' acquisto di persona',
        value: this.kart ? this.kart.online : false,
        required: false,
        order: 4
      }),
      new DateQuestion({
        key: 'dataAcquisto',
        // tslint:disable-next-line: quotemark
        label: "data di acquisto",
        value: this.kart ? this.kart.purchaseDate.formatDate() : new DateModel(new Date()).formatDate(),
        required: true
      }),
      new SelectorQuestion(
        {
          label: 'Pagamento',
          key: 'payment',
          value: this.kart ? this.kart.pagamento : new PaymentsModel(),
          required: true,
          service: this.paymentsService,
          text: this.textSelectPayment,
          createPopup: CreatePaymentPage
        }
      ),
      new SelectorQuestion(
        {
          label: 'Fornitore',
          key: 'supplier',
          required: true,
          text: this.textSelectSupplier,
          sorterFunction: this.supplierSorterFunction,
          service: this.supplierService,
          createPopup: CreateSupplierPage
          ,
          value: this.kart ? this.kart.fornitore : new SupplierModel()

        }
      )
    ];


  }


  calculateTotal() {
    const reducer: (acc: number, curr: PurchaseModel) => number = (acc: number, curr: PurchaseModel) => {
      return (curr && curr.prezzo) ? acc + curr.prezzo : acc
    }
    return this.kart.items ? this.kart.items.reduce<number>(reducer, 0) : 0
  }

  ngOnInit() {
    this.kart = this.navParams.get('item')
    /**
     * spaghetti code TODO remove asap
     */
    this.paymentsService.items.subscribe(payments => {
      if (this.kart) {
        this.kart.setPayment(payments.filter(pay => pay.key == this.kart.pagamentoId)[0])
        this.setKartFields()
      }
    })
    /**
     * spaghetti code TODO remove asap
     */
    this.supplierService.items.subscribe(suppliers => {
      if (this.kart) {
        this.kart.setSupplier(suppliers.filter(sup => sup.key == this.kart.fornitoreId)[0])
        this.setKartFields()
      }
    })
    this.supplierSorterFunction = (a: SupplierModel, b: SupplierModel) => {
      return this.geo.distance(a.address.latitude, a.address.longitude, this.position.latitude, this.position.longitude) -
        this.geo.distance(b.address.latitude, b.address.longitude, this.position.latitude, this.position.longitude);
    }

    if (this.kart) {
      this.kart.load().finally(() => {
        this.title = `${this.kart.title} ${this.kart.moneta} ${this.kart.totale}`

      })
    }



  }
  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    })
    toast.present()

  }

  async submit(ev: any) {
    // TODO: sostituire any con un tipo definito
    this.showSpinner = true
    this.kart.title = ev.title
    this.kart.note = ev.note
    this.kart.online = ev.ecommerce


    this.kart.purchaseDate.updateDate(ev.dataAcquisto)
    this.service.updateItem(this.kart).then(() => {
      this.showSpinner = false
      this.dismiss()
    })

  }


  removeItem(item: PurchaseModel, slidingitem) {
    this.kart.removeItem(item)
    this.kart.totale = this.rounderPipe.transform(this.calculateTotal())
    this.title = `${this.kart.title}: ${this.kart.moneta} ${this.kart.totale}`
  }

  async addPurchase() {
    const modal = await this.modalCtrl.create({ component: CreatePurchasePage })
    modal.onDidDismiss().then((purchase) => {
      const Purchase = purchase.data
      this.kart.addItem(Purchase)
      this.kart.totale = this.rounderPipe.transform(this.calculateTotal())
      this.title = `${this.kart.title}: ${this.kart.moneta} ${this.kart.totale}`
    })
    return await modal.present()
  }

  async detailPurchase(purchase, slidingitem) {

    const modal = await this.modalCtrl.create({ component: DetailPurchasePage, componentProps: { purchase } })
    modal.onDidDismiss().then(data => {
      this.kart.updateItem(data.data)
      slidingitem.close()
    })
    return await modal.present()
  }

  setTotal(tot: number) {
    this.kart.totale = Math.round(tot * 100) / 100
    this.title = `${this.kart.title} ${this.kart.moneta} ${tot}`
  }

  async selectedSupplier(supplier: SupplierModel) {
    if (supplier) {

      this.kart.setSupplier(supplier)
    }
  }

  selectedPayment(payment: PaymentsModel) {
    if (payment) {
      this.kart.setPayment(payment)

    }
  }

  filter(ev: {}) {
    // tslint:disable: no-string-literal
    if (ev['payment']) {
      this.selectedPayment(ev['payment'])
    }
    if (ev['supplier']) {
      this.selectedSupplier(ev['supplier'])
    }
    // tslint:disable-next-line: no-string-literal
    if (ev['ecommerce']) {
      this.supplierFilterFunction = (item: SupplierModel) => {
        return item.ecommerce
      }
    } else {
      this.supplierFilterFunction = (item) => true
    }
  }


  dismiss() {
    this.modalCtrl.dismiss()
  }

}
