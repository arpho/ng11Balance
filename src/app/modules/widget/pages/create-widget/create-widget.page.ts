import { Component, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/modules/dynamic-form/models/question-base';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { Widget } from '../../models/Widget';
import { SwitchQuestion } from 'src/app/modules/item/models/question-switch';
import { ModalController, NavParams } from '@ionic/angular';
import { WidgetService } from '../../services/widget-service';
import { SelectorQuestion } from 'src/app/modules/dynamic-form/models/question-selector';
import { DateQuestion } from 'src/app/modules/dynamic-form/models/question-date';
import { DropdownQuestion } from 'src/app/modules/dynamic-form/models/question-dropdown';
import { RoleModel } from 'src/app/modules/user/models/privilegesLevelModel';
import { CategoriesService } from 'src/app/services/categories/categorie.service';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import { SuppliersService } from 'src/app/services/suppliers/suppliers.service';
import { runInThisContext } from 'vm';
import { ItemServiceInterface } from 'src/app/modules/item/models/ItemServiceInterface';
import { thresholdFreedmanDiaconis } from 'd3';
import { FormGroup } from '@angular/forms';
import { ComboValue } from 'src/app/modules/dynamic-form/models/ComboValueinterface';
import { WidgetTypes } from '../../models/WidgetsTypes';
import { WidgetSince } from '../../models/WidgetSince';
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';

@Component({
  selector: 'app-create-widget',
  templateUrl: './create-widget.page.html',
  styleUrls: ['./create-widget.page.scss'],
})
export class CreateWidgetPage implements OnInit {
  title: string
  widgetFields: any[]
  widget: Widget
  order=0
  Form: FormGroup // listener to the form


  constructor(public modalCtrl: ModalController, public navParams: NavParams, public service: WidgetService, public categoriesService: CategoriesService, public paymentsService: PaymentsService, public suppliersService: SuppliersService) {
    this.title = "crea un nuovo Widget"
    this.widget = new Widget()
    this.widgetFields = this.FormFieldsFactory(this.widget)
    this.widgetsServices.services[this.categoriesService.key] = this.categoriesService
    this.widgetsServices.services[this.suppliersService.key] = this.suppliersService
    this.widgetsServices.services[this.paymentsService.key] = this.paymentsService
  }

  dismiss(payment?) {
    this.modalCtrl.dismiss(payment)
  }

  filter(ev) {
  }


  widgetsServices: { options: ComboValue[], services: {} } = {
    options: [
      new RoleModel({ key: this.categoriesService.entityLabel, value: this.categoriesService.key }),
      new RoleModel({ key: this.paymentsService.entityLabel, value: this.paymentsService.key }),
      new RoleModel({ key: this.suppliersService.entityLabel, value: this.suppliersService.key })
    ],
    services: {}
  };


  protected FormFieldsFactory(ev?) {
    const widgetTypes = [new RoleModel({ key: 'sinceWidget', value: WidgetTypes.Since }),
    new RoleModel({ key: 'regular', value: WidgetTypes.Regular })]
    let out: QuestionBase<unknown>[] = [
      new TextboxQuestion({
        key: 'title',
        label: 'nome del widget',
        value: this.widget.title,
        order: 1
      }),
      new TextAreaBox({
        key: 'note',
        label: 'note',
        value: this.widget.note,
        order: 2
      }),
      new DropdownQuestion({
        key: 'serviceKey',
        label: 'sorgente dati',
        options: this.widgetsServices.options,
        value: this.widget._serviceKey
      }),
      new SwitchQuestion({
        key: 'counter',
        label: 'contatore/sommatore',
        labelTrue: 'widget contatore',
        labelFalse: ' widget sommatore',
        iconFalse: 'calculator',
        iconTrue: 'stopwatch',
        value: this.widget._counter,
        required: false,
        order: 4
      }),
      new SelectorQuestion({
        key: 'item',
        service: this.widgetsServices.services[this.widget._serviceKey],
        label: 'seleziona  item',
        text: 'non so che scrivere',
        value: this.widget._item,
        createPopup: undefined
      }),
      new DropdownQuestion({
        key: 'widget',
        label: 'widget type',
        options: widgetTypes,
        value: this.widget.widget


      })
    ];
    out = [...out, ...this.widget.extraField4Form()]
    if (ev && ev.widget) {
      this.widget = this.service.widgetFactory(Number(ev.widget)).load(this.widget)

    }
    if ((ev && ev.serviceKey) || this.widget.item) {
      this.widget.serviceKey = (ev && ev.serviceKey) ? ev.serviceKey : this.widget._serviceKey // spaghetti code @TODO change it from does not update this field
      out = out.filter(widget => widget.key != 'item') // remove the dummy question field
      out.push(new SelectorQuestion({
        key: 'item',
        value: this.widget.item,
        service: (ev && ev.serviceKey) ? this.widgetsServices.services[ev._serviceKey || ev.serviceKey] : this.widget.serviceKey,
        label: 'seleziona  ' + (ev && ev.serviceKey) ? this.widgetsServices.services[ev._serviceKey || ev.serviceKey].title : 'una sorgente dati',
        text: 'non so che scrivere',
        createPopup: undefined
      }))
    }
    return out
  }

  setForm(form: FormGroup) {
    this.Form = form
    // tslint:disable-next-line: no-string-literal
    this.Form.controls['serviceKey'].valueChanges.subscribe(ev => {
      this.widgetFields = this.FormFieldsFactory({ serviceKey: ev })
    })
    this.Form.controls['widget'].valueChanges.subscribe(ev => {
      this.widget = this.service.widgetFactory(ev).load(this.widget)
      this.widgetFields = this.FormFieldsFactory({ widget: ev })
    })
  }

  async submit(ev) {
    const widget = this.widget.load(ev)
    if (ev.entityKey) {

      widget.entityKey = ev.entityKey.key
    }
    widget.order  = this.order
    const out = await this.service.add(widget.serialize())
    this.dismiss()
    /*   this.service.put(String(this.widget.key), this.widget.serialize(), (v) => {
      v.then((wid => {
        console.log('created', wid)
        this.dismiss()
      }))
    })   */
  }

  ngOnInit() {

    this.order = this.navParams.get('order')
    console.log('order',this.order)
  }

}
