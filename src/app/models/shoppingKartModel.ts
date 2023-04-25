// tslint:disable:semicolon
import { ItemModelInterface, Genere } from '../modules/item/models/itemModelInterface';
import { SupplierModel } from './supplierModel';
import { PaymentsModel } from './paymentModel';
import { PurchaseModel } from './purchasesModel';
// import { getTranslationForTemplate } from '@angular/core/src/render3/i18n';
import { Value } from '../modules/item/models/value';
// import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { ItemServiceInterface } from '../modules/item/models/ItemServiceInterface';
import { QuickAction } from '../modules/item/models/QuickAction';
import { CategoriesService } from '../services/categories/categorie.service';
import { PaymentsService } from '../services/payments/payments.service';
import { SuppliersService } from '../services/suppliers/suppliers.service';
import { DateModel } from '../modules/user/models/birthDateModel'
import { ShoppingKartsService } from '../services/shoppingKarts/shopping-karts.service';
import { OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, VirtualTimeScheduler } from 'rxjs';
import { OfflineItemModelInterface, offlineSerializer } from '../modules/offline/models/offlineItemModelInterface';

export class ShoppingKartModel implements OfflineItemModelInterface {
  quickActions?: QuickAction[];
  archived: boolean;
  dataAcquisto: string
  purchaseDate: DateModel
  dataAddebito: string
  public fornitore: SupplierModel;
  fornitoreId: string; // campo di comodo
  pagamentoId: string // campo di comodo
  key: string
  title = ''
  moneta = '€'
  public pagamento: PaymentsModel
  online: boolean
  tassoConversione: number
  items: Array<PurchaseModel> // for back compatibility
  purchases: Array<PurchaseModel>
  note: string
  // -next-line: semicolon


  constructor(args?: { key?: string, item?: {} }) {
    this.items = []
    this.purchaseDate = new DateModel(new Date())
    if (args) {

      this.key = (args.key) ? args.key : ''
      //this.service = (args.service) ? args.service : undefined

    }
    this.quickActions = [

    ]


  }
  entityLabel = "Shoppingkart"
  serialize4OfflineDb(): offlineSerializer<{ entityLabel: string; }> {
    const entityLabel = this.entityLabel
    return { ...this.serialize(), entityLabel: this.entityLabel }
  }
  service?: ItemServiceInterface;
  aggregateAction?() {
    throw new Error('Method not implemented.');
  }

  get totale() {
    const reducer: (acc: number, curr: PurchaseModel) => number = (acc: number, curr: PurchaseModel) => {
      return (curr && curr.prezzo) ? Number(acc) + Number(curr.prezzo) : Number(acc)
    }
    return this.items ? this.items.reduce<number>(reducer, 0) : 0
  }
  set totale(value) { } //dummy setter to let initialization of the model 

  getCategoriesKeys() {
    const reducer = (accumulator: Array<string>, cv: Array<string>) => accumulator = [...accumulator, ...cv]
    return this.items.map((purc: PurchaseModel) => purc.getCategoriesKeys()).reduce(reducer, [])
  }

  hasCategoryKey(key: string) {
    return this.getCategoriesKeys().includes(key)
  }


  hasPurchaseDescription(description: string) {
    const mapper = (item: PurchaseModel) => item.descrizione // transform a listof purchase in a list of description
    const reducer = (accumulator: boolean, cv: string) => accumulator = accumulator || cv ? cv.toUpperCase().includes(
      description
        .toUpperCase()) : false
    return this.items.map(mapper).reduce(reducer, false)// checs if at least one of the purchases' description conatains the required description
  }



  getSupplier() {
    return this.fornitore
  }

  getPayment() {
    return this.pagamento
  }

  getQuickActions() {
    return this.quickActions
  }
  build(item: {}) {
    Object.assign(this, item)
    this.fornitore = new SupplierModel()
    this.pagamento = new PaymentsModel()
    this.totale = item['totale']
    this.fornitore.key = this.fornitore.key || this.fornitoreId
    this.pagamento.key = this.pagamento.key || this.pagamentoId
    this.items = (this.items) ? this.items.map(Item => new PurchaseModel(Item)) : []
    // gli items sono stati tutti definiti non hanno ancora caricato le categorie
    this.purchaseDate = this.dataAcquisto ? new DateModel(new Date(this.dataAcquisto)) : new DateModel(new Date())
    return this
  }
  isArchived(): boolean {
    return this.archived
  }

  archiveItem?(b: boolean) {
    this.archived = b
  }
  isArchivable?(): boolean {
    return true;
  }

  setKey(key: string) {
    this.key = key
    return this
  }

  setSupplier(supplier: SupplierModel) {
    this.fornitore = supplier
    this.fornitoreId = supplier?.key
  }

  setPayment(pay: PaymentsModel) {
    this.pagamento = pay
    this.pagamentoId = pay?.key
  }

  addItem(purchase: PurchaseModel) {
    this.items = [...this.items, purchase]
  }

  removeItem(purchase: PurchaseModel) {
    this.items = this.items.filter((v: PurchaseModel) => v.key !== purchase.key)
  }

  updateItem(purchase: PurchaseModel) {
    if (purchase) {
      this.items = this.items.map((item: PurchaseModel) => (item?.key === purchase?.key) ? purchase : item)
    }
  }

  getValue3(): Value {
    return new Value({ value: this.purchaseDate.formatDate(), label: '' })
  }

  getValue4(): Value {
    var out = new Value({ value: '', label: 'titolo spesa' }) //  senza fornitore, nè titolo, potrebbero esserci vecchi carrelli senza fornitore

    if (this.fornitore) {
      out = new Value({ value: this.fornitore.getTitle().value, label: ' titolo ' })
    }

    if (this.title) {
      out = new Value({ value: this.title, label: ' titolo ' })
    }

    return out

  }
  getEditPopup(item?: ItemModelInterface, service?: ItemServiceInterface) {
    throw new Error('Method not implemented.');
  }

  getAggregate(): Value {
    return new Value({ value: undefined, label: 'aggregate to be defined' })
  }

  hasQuickActions?(): boolean {
    return false;
  }
  private getFornitoreId() {
    var out = this.fornitoreId

    if (this.fornitore) {
      out = this.fornitore.key


      if (!out) { out = '' }

      return out

    }
  }

  private getPagamentoId() {
    var out = this.pagamentoId

    if (this.pagamento) {
      out = this.pagamento.key

      if (!out) { out = '' }
    }

    return out
  }

  serialize() {
    return {
      fornitoreId: this.getFornitoreId(),

      pagamentoId: this.getPagamentoId(),

      key: this.key || '',

      note: this.note || '',

      archived: Boolean(this.archived),

      online: Boolean(this.online),

      dataAcquisto: this.purchaseDate ? this.purchaseDate.formatFullDate() : '',

      title: this.title || '',


      items: this.items.map((item: PurchaseModel) => item.serialize())
    }
  }

  getElement(): { element: string; genere: Genere } {

    const genere: Genere = 'a';
    return { element: 'carrello della spesa', genere };
  }
  getTitle() {
    // tslint:disable: semicolon
    return new Value({ value: this.getValue4().value, label: ' titolo ' })

  }

  getCountingText() {
    return ' Carrelli della spesa'
  }

  getValue2() {
    return new Value({ value: this.moneta + ' ' + Math.round(this.totale * (this.tassoConversione || 1) * 100) / 100, label: 'totale' })
  }

  getRoundedTotal() {
    return Math.round(this.totale * 100) / 100
  }

  getNote() {
    return new Value({ value: this.note, label: 'nota' })
  }
  schema = {
    title: "shoppingkart",
    version: 0,
    primaryKey: "key",
    properties: {
      key: {
        type: 'string',
        maxLength: 100
      },
      fornitoreId: {
        type: 'string'
      },
      pagamentoId: {
        type: 'string'
      },
      archived: {
        type: 'boolean'
      },
      dataAcquisto: {
        type: 'string'
      },
      title: {
        type: 'string'
      },
      totale:{
        type:'number'
      },
      note: {
        type: 'string'
      },
      online: {
        type: 'string'
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            barcode: 'string',
            descrizione: 'string',
            moneta: 'string',
            picture: 'string',
            categorieId: {
              type: 'array',
              items: {
                type: 'string'
              },
              key: { type: 'string' },
              note: {
                type: 'string'
              },
              prezzo: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }

  initialize(cart) {
    Object.assign(this, cart)
    this.purchaseDate = new DateModel(new Date(this.dataAcquisto))
    // purchaseDate deve sempre essere definito
    this.purchaseDate = this.dataAcquisto ? new DateModel(new Date(this.dataAcquisto)) : new DateModel(new Date())
    return this
  }

  async load(next?: () => void) {

    // items  loaded and categories instantiated but not loaded
    this.fornitore = new SupplierModel(undefined, this.fornitoreId)
    this.pagamento = new PaymentsModel(undefined, this.pagamentoId)
    //this.fornitore.load(next)
    // this.pagamento.load()
    if (this.items) { // ci sono carrelli senza acquisti
      // this.items = this.loadPurchases(this.items, this.service.extraService0)
      // this.items = this.items.map(pur => new PurchaseModel(pur, this.service.extraService0))// .map(p => p.load())
      this.items.forEach(p => p.load()) // carica le categorie degli acquisti
    }
    // this.title = this.title || `${this.fornitore.getTitle().value}  ${new DateModel(new Date(this.dataAcquisto)).formatDate()}`
    return this
  }

  loadPurchases(items: {}[], categories?): PurchaseModel[] {
    return items.map(value => {
      const purchase = new PurchaseModel(value)
      purchase.load()
      return purchase
    })

  }

}
