import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, } from '@angular/core';
import { Widget } from '../../models/Widget';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
import { BehaviorSubject } from 'rxjs';
import { thresholdFreedmanDiaconis } from 'd3';


@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent implements OnInit, OnChanges {
  @Input() Widget: Widget
  @Input() items: BehaviorSubject<ItemModelInterface[]>
  showSpinner = true

  constructor() {
    this.Widget && this.Widget.Value.subscribe(v => {
      console.log('v', v)
      if (v != -1) {
        this.showSpinner = false
      }
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.items.subscribe(karts => {
      this.Widget.items_list = karts
    })
  }

  ngOnInit() {
  }

}
