import { EntityWidgetServiceInterface } from './EntityWidgetServiceInterface';
import { BehaviorSubject, Observable } from 'rxjs';
import { Value } from '../../item/models/value';
import { ItemModelInterface } from '../../item/models/itemModelInterface';
import { WidgetTypes, WidgetOperation } from './WidgetsTypes';
import { TextboxQuestion } from '../../dynamic-form/models/question-textbox';
import { QuestionBase } from '../../dynamic-form/models/question-base';
import { SwitchQuestion } from '../../item/models/question-switch';
import { SelectorQuestion } from '../../dynamic-form/models/question-selector';
import { ItemServiceInterface } from '../../item/models/ItemServiceInterface';

export interface Widgetparams { service: EntityWidgetServiceInterface, serviceKey: string, entityKey: string, temporalWindow: number, counter: boolean, _order: number, _key?: number, note?: string, title?: string, description?: string }

export class Widget {
    _title: string;
    _note: string
    _description: string
    _key: string;
    _serviceKey: string
    _service: EntityWidgetServiceInterface
    _item: ItemModelInterface
    _entityKey: string //identify the entityKey
    _id: number
    widget = WidgetTypes.Regular
    _items_list: ItemModelInterface[]

    set items_list(items: ItemModelInterface[]) {
        this._items_list = items
        this.Item.subscribe(item => { // both items and item are ready i can calculate Value

            this.Service.subscribe(service => {
                if (item && items && service) {
                    this._Value.next(this.calculateWidget(item.key))
                }
            })

        })
    }

    get items_list() {
        return this._items_list
    }


    _Service: BehaviorSubject<EntityWidgetServiceInterface> = new BehaviorSubject(undefined)
    readonly Service: Observable<EntityWidgetServiceInterface> = this._Service.asObservable()
    _Value: BehaviorSubject<number> = new BehaviorSubject(-1) // per distinguere se primo valore  dal reale valore calcolato
    readonly Value: Observable<number> = this._Value.asObservable()
    __item: BehaviorSubject<ItemModelInterface> = new BehaviorSubject(undefined)
    readonly Item: Observable<ItemModelInterface> = this.__item.asObservable()
    _text: BehaviorSubject<string> = new BehaviorSubject('') // show the widget's text
    readonly text: Observable<string> = this._text.asObservable()
    _counter: boolean
    constructor(args?: Widgetparams) {
        this.load(args)
        // this._key = this._key || new Date().getTime()


    }

    extraField4Form(): QuestionBase<unknown>[] {
        return [

            new TextboxQuestion({
                type: 'number',
                key: 'temporalWindow',
                label: 'giorni di osservazione',
                required: true,
                value: this.temporalWindow
            })
        ]
    }


    set item(item: ItemModelInterface) {
        this._item = item
        this._entityKey = item.key
        this._text.next(`${this.getFirstWord()} ${item['widgetText']} negli ultimi ${this.temporalWindow} giorni: `)
        this.__item.next(item)
    }

    get item() {
        return this._item
    }

    set serviceKey(serviceKey: string) {
        this._serviceKey = serviceKey
    }

    get serviceKey() {
        return this._serviceKey
    }

    set counter(counter) {
        this._counter = counter
    }

    get counter() {
        return this._counter
    }

    set id(id: number) {
        this._id = id
    }

    get id() {
        return this._id
    }

    set title(title: string) {
        this._title = title
    }

    set entityKey(entityKey: string) {
        this._entityKey = entityKey
    }

    get entityKey() {
        return this._entityKey
    }

    get title() {
        return this._title
    }

    set note(note: string) {
        this._note = note
    }
    get note() {
        return this._note
    }
    set description(description: string) {
        this._description = description
    }

    get description() {
        return this._description
    }
    archived?: boolean;
    getTitle(): Value {
        if (this.counter) {
            return new Value({ label: 'widget', value: 'negli' })

        }
        return new Value({ label: 'widget', value: 'totale' })
    }
    // service: EntityWidgetServiceInterface
    temporalWindow: number
    _order: number


    private value: BehaviorSubject<Value> // = new BehaviorSubject

    set order(value: number) {
        this._order = value
    }
    async getText() {
        let out: Promise<string>
        if (!this.counter) {
            return new Promise((resolve, reject) => {

                resolve(` totale spese ${this.item['widgetText']} negli ultimi ${this.temporalWindow} giorni:`)
            })
        }

    }
    getFirstWord() {

        return this.counter ? 'Occorrenze' : 'Spesa'
    }

    filterFactory() {
        // console.log('temporal window', this.temporalWindow)
        return (item: ItemModelInterface) => {
            const date = new Date()
            date.setDate(date.getDate() - this.temporalWindow)
            // console.log('ciao',date,item['purchaseDate'],item['purchaseDate']>=date)
            return item['purchaseDate'] >= date
        }

    }


    get order() {
        return this._order
    }


    get key() {
        return this._key
    }

    
    load(args) {
        Object.assign(this, args)
        this.Item.subscribe(value => {
            this._item = value
        })
        this.key = this.key || this._key
        this.widget = WidgetTypes.Regular
        this.temporalWindow = Number(this.temporalWindow)
        return this
    }

    set key(key) {
        key && (this._key = key)
    }

    set service(service: EntityWidgetServiceInterface) {
        this._service = service
        this._Service.next(service)

    }

    get service() {
        return this._service
    }

    getEntityKey() {
        if (this._item) {
            return this._item.key
        }
        return this.entityKey

    }

    serialize() {
        return {
            temporalWindow: this.temporalWindow || 0,
            entityKey: this.getEntityKey() || this._entityKey,
            serviceKey: this._serviceKey || '',
            key: this._key||'',
            description: this._description || '',
            note: this._note || '',
            title: this._title || '',
            counter: this._counter||false,
            id: this._id || 0,
            _order: this._order || 0,
            widget: WidgetTypes.Regular // r'regular||by

        }
    }

    mockCalculateWidget() {
        return this.counter ? WidgetOperation.Counter : WidgetOperation.Adder
    }




    calculateWidget(key: string) {
        if (this._items_list) {
            if (this.counter)
                return this.service.counterWidget(this.entityKey, this._items_list.filter(this.filterFactory()))

            return this.service.adderWidget(this.entityKey, this._items_list.filter(this.filterFactory()))
        }
    }
}