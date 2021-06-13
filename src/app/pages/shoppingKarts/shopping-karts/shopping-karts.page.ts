import { Component, OnInit } from '@angular/core';
import { ItemControllerInterface } from 'src/app/modules/item/models/ItemControllerInterface';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
import { ShoppingKartsService } from 'src/app/services/shoppingKarts/shopping-karts.service';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';
import { runInThisContext } from 'vm';
import { TextboxQuestion } from 'src/app/modules/item/models/question-textbox';
import { SwitchQuestion } from 'src/app/modules/item/models/question-switch';
import { DateQuestion } from 'src/app/modules/dynamic-form/models/question-date';
import { SelectorQuestion } from 'src/app/modules/dynamic-form/models/question-selector';
import { SupplierModel } from 'src/app/models/supplierModel';
import { PaymentsModel } from 'src/app/models/paymentModel';
import { Value } from 'src/app/modules/item/models/value';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import { SuppliersService } from 'src/app/services/suppliers/suppliers.service';
import { CreateShoppingKartPage } from '../../create-shopping-kart/create-shopping-kart.page';
import { DetailShoppingKartPage } from '../../detail-shopping-kart/detail-shopping-kart.page';
import { CreateSupplierPage } from '../../create-supplier/create-supplier.page';
import { CreatePaymentPage } from '../../create-payment/create-payment.page'
import { DateModel } from 'src/app/modules/user/models/birthDateModel';

@Component({
  selector: 'app-shopping-karts',
  templateUrl: './shopping-karts.page.html',
  styleUrls: ['./shopping-karts.page.scss'],
})
export class ShoppingKartsPage implements OnInit, ItemControllerInterface {
  ItemsList: ShoppingKartModel[];
  filterLabel: string;
  filterString: string;
  secondSpinner: boolean;
  createModalPage = CreateShoppingKartPage
  public editModalPage = DetailShoppingKartPage
  filterFields: any;
  filterFunction: (item: ShoppingKartModel) => boolean;
  sorterFunction: (a: ShoppingKartModel, b: ShoppingKartModel) => number =
    (a: ShoppingKartModel, b: ShoppingKartModel) => {
      // tslint:disable: semicolon
      const dateA = a.purchaseDate.getFullDate()
      const dateB = b.purchaseDate.getFullDate()
      return this.compareDate(dateA, dateB)
    }

  compareDate = (a: Date, b: Date) => a > b ? -1 : a < b ? 1 : 0




  createItem() {
    throw new Error('Method not implemented.');
  }

  constructor(public service: ShoppingKartsService,
    public paymentsService: PaymentsService,
    public SuppliersService: SuppliersService) {
    const filterDescription = (value: string, item: ShoppingKartModel) =>
      (item.title) ? item.title.toUpperCase().includes(value.toUpperCase()) : true // i vecchi acquisti non hanno il campo title
    const filterNote = (value: string, item: ShoppingKartModel) => item.note ? item.note.toUpperCase().includes(value.toUpperCase()) : false
    const filterOnline = (value, item: ShoppingKartModel) => item.online == value
    const filterAfterDate = (value: string, item: ShoppingKartModel) => item.purchaseDate ? item.purchaseDate.getFullDate() >= new Date(value) : false
    const filterBeforeDate = (value: string, item: ShoppingKartModel) => item.purchaseDate ? item.purchaseDate.getFullDate() <= new Date(value) : false
    const filterBySupplier = (value: SupplierModel, item: ShoppingKartModel) => item.fornitore ? item.fornitore.key == value.key : false
    const filterByPayment = (value: PaymentsModel, item: ShoppingKartModel) => item.pagamento ? item.pagamento.key == value.key : false
    const filterByCategory = (value: CategoryModel, item: ShoppingKartModel) => item.hasCategoryKey(value.key)
    const flterByPurchaseDescription = (value: string, item: ShoppingKartModel) => item.hasPurchaseDescription(value)
    const today = new Date()
    this.filterFields = [
      new TextboxQuestion({
        key: 'description',
        label: 'filtra per descrizione',
        filterFunction: filterDescription,
        order: 1
      }),
      new TextboxQuestion({
        key: 'note',
        label: 'filtra per note',
        filterFunction: filterNote,
        order: 2
      }),
      new SwitchQuestion({
        key: 'ecommerce',
        label: 'filtra per modalità di acquisto',
        labelTrue: ' acquistato online',
        labelFalse: ' acquistato di persona',
        iconTrue: 'wifi',
        iconFalse: 'person',
        required: false,
        filterFunction: filterOnline,
        order: 3
      }),
      new DateQuestion({
        key: 'dateAfter',
        value: new DateModel(new Date(today.getTime()-30*(1000*60*60*24) )).formatDate(),
        // tslint:disable-next-line: quotemark
        label: " acquistato dopo",
        // value: kart.purchaseDate.formatDate(),
        filterFunction: filterAfterDate,
        order: 3
      }),
      new DateQuestion({
        key: 'dateBefore',
        value: new DateModel(new Date()).formatDate(),
        label: "acquistato prima",
        filterFunction: filterBeforeDate,
        order: 4
      }),
      new SelectorQuestion({
        key: 'supplier',
        text: ' Fornitore',
        label: 'filtra per fornitore',
        service: this.SuppliersService,
        filterFunction: filterBySupplier,
        order: 5,
        createPopup: CreateSupplierPage
      }),
      new SelectorQuestion({
        key: 'payment',
        text: 'Pagamento',
        createPopup: CreatePaymentPage,
        label: 'filtra per pagamento',
        service: this.paymentsService,
        filterFunction: filterByPayment,
        order: 6

      }),
      new SelectorQuestion({
        key: 'category',
        text: ' una categoria',
        label: 'filtra per categoria',
        service: this.service.categoriesService,
        filterFunction: filterByCategory,
        order: 7,
        createPopup: ''
      }),
      new TextboxQuestion({
        key: 'purchaseDescription',
        label: 'filtra per acquisto',
        filterFunction: flterByPurchaseDescription,
        order: 8
      }),
    ];
  }

  setFilterFunction(filter) {
    if (filter) {
      this.filterFunction = filter
    }
  }

  async ngOnInit() {
    this.secondSpinner = true
    this.ItemsList = [];
    this.service.items.subscribe(items => {
      this.ItemsList = items
      this.secondSpinner = false
    })
  }

  filter(fileds) {
  }

  viewGraps() {

  }

}
