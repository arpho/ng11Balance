import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WidgetService } from '../../services/widget-service';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';
import { ShoppingKartsService } from 'src/app/services/shoppingKarts/shopping-karts.service';
import { Widget } from '../../models/Widget';
import { ModalController } from '@ionic/angular';
import { CreateWidgetPage } from '../../pages/create-widget/create-widget.page';
import { EditWidgetPage } from '../../pages/edit-widget/edit-widget.page';
import { BehaviorSubject } from 'rxjs';
import { ComponentsPageModule } from 'src/app/modules/item/components/components.module';

import { take } from 'rxjs/operators';

@Component({
  selector: 'app-widget-drawer',
  templateUrl: './widget-drawer.component.html',
  styleUrls: ['./widget-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetDrawerComponent implements OnInit {
  keys
  showSpinner = true
  widgetsCount = 0
  Widgets: Widget[]
  items: BehaviorSubject<ShoppingKartModel[]> // = []

  async createWidget() {
    const modal = await this.modalController.create({
      component: CreateWidgetPage,
      componentProps: { order: this.widgetsCount }
    })
    return await modal.present()
  }

  deleteWidget(widget, sliding_item) {
    sliding_item['close']()
    this.service.delete(widget.key, (pr: Promise<any>) => {
      pr.then(res => {
      })
    })
  }

  async updateWidget(widget, sliding_item) {
    sliding_item['close']()
    const modal = await this.modalController.create({
      component: EditWidgetPage,
      componentProps: { widget }
    })
    return await modal.present()
  }

  setOrder = (widget: Widget, index: number) => {
    widget.order = index
    return widget

  }

  updateOrder = ((widget: Widget) => {
    console.log('updating', widget)
    this.service.updateWidget(widget.serialize())
  })

  doReorder(ev) {
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to)
    // widgetService push a new list every time a widget is modified, then we get only the first emission
    this.service.widgetsList.pipe(take(1)).toPromise().then(widgets => {

      widgets['move'](ev.detail.from, ev.detail.to).map(this.setOrder).forEach(this.updateOrder);
    })
    ev.detail.complete()

  }



  constructor(public service: WidgetService, public karts: ShoppingKartsService,
    public modalController: ModalController,) {
      this.service.widgetsList.subscribe(v=>{
        if(v.length!=0){
        this.showSpinner = false}
      })
    Array.prototype['move'] = function (pos1, pos2) {
      // local variables
      var i, tmp;
      // cast input parameters to integers
      pos1 = parseInt(pos1, 10);
      pos2 = parseInt(pos2, 10);
      // if positions are different and inside array
      if (pos1 !== pos2 && 0 <= pos1 && pos1 <= this.length && 0 <= pos2 && pos2 <= this.length) {
        // save element from position 1
        tmp = this[pos1];
        // move element down and shift other elements up
        if (pos1 < pos2) {
          for (i = pos1; i < pos2; i++) {
            this[i] = this[i + 1];
          }
        }
        // move element up and shift other elements down
        else {
          for (i = pos1; i > pos2; i--) {
            this[i] = this[i - 1];
          }
        }
        // put element from position 1 to destination
        this[pos2] = tmp;
      }
      return this
    }

    this.items = this.karts._items
    this.service.widgetsList.subscribe(widgets => {
      this.widgetsCount = widgets.length
    })
    this.karts._items.subscribe((karts: ShoppingKartModel[]) => {
      // this.items =[... karts]

    })



  }

  ngOnInit() { }

}
