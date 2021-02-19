import { Widget, Widgetparams } from './Widget';
import { EntityWidgetServiceInterface } from './EntityWidgetServiceInterface';
import { BehaviorSubject } from 'rxjs';
import { Value } from '../../item/models/value';
import { ItemModelInterface } from '../../item/models/itemModelInterface';
import { WidgetTypes } from './WidgetsTypes';
import { DateModel } from '../../user/models/birthDateModel';
import { QuestionBase } from '../../dynamic-form/models/question-base';
import { DateQuestion } from '../../dynamic-form/models/question-date';

export interface WidgetSinceParams extends Widgetparams {
    sinceDate: string
}

export class WidgetSince extends Widget {
    MySinceDate: DateModel
    widget = WidgetTypes.Since
    sinceDate: string // campo data serializzato dal db
    constructor(args?: WidgetSinceParams) {
        super(args)
        this.widget = WidgetTypes.Since

    }


    extraField4Form(): QuestionBase<unknown>[] {
        return [

            new DateQuestion({
                key: 'temporalWindow',
                label: 'inizio periodo di osservazione',
                value: this.MySinceDate.formatDate(),
                required: true
            }),
        ]
    }

    filterFactory() {
        return (item: ItemModelInterface) => {
            const date = new Date()
            date.setDate(date.getDate() - this.temporalWindow)
            return item['purchaseDate'] >= this.MySinceDate.fullDate
        }

    }



    set item(item: ItemModelInterface) {
        this._item = item
        this._entityKey = item.key
        this._text.next(`${this.getFirstWord()} ${item['widgetText']} dal ${this.MySinceDate.formatDate()} : `)
        this.__item.next(item)
    }

    load(args) {
        Object.assign(this, args)
        this.MySinceDate = new DateModel(this.temporalWindow)
        this.widget = WidgetTypes.Since
        return this
    }


    async getText() {
        if (!this.counter) {
            return ` totale spese ${this.item['widgetText']} dal ${this.MySinceDate.serialize()}:`
        }
        return ` totale spese ${this.item['widgetText']} dal ${this.MySinceDate.serialize()}:`

    }

    serialize() {
        return {
            temporalWindow: this.temporalWindow || 0,
            entityKey: this.entityKey || '',
            key: this._key,
            description: this._description || '',
            note: this._note || '',
            title: this._title || '',
            counter: this._counter||false,
            id: this._id || 0,
            _order: this.order || 0,
            serviceKey: this.serviceKey || '',
            sincedate: this.MySinceDate.serialize(),
            widget: WidgetTypes.Since // r'regular||by

        }
    }
}