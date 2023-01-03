import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { ItemHostDirective } from '../../directives/item-host.directive';
import { ItemsListInterface } from '../../models/itemlistInterface';

@Component({
  selector: 'app-items-host',
  templateUrl: './items-host.component.html',
  styleUrls: ['./items-host.component.scss'],
})
export class ItemsHostComponent implements OnInit {
@Input() item:unknown
@Input() itemComponent
@ViewChild(ItemHostDirective, {static: true}) itemHost!: ItemHostDirective;
  constructor(private resolver:ComponentFactoryResolver) { }

  ngOnInit() {

    const _viewContainerRef = this.itemHost.viewContainerRef;
      //removes all views in that container
      _viewContainerRef.clear();
      const itemRef = _viewContainerRef.createComponent<ItemsListInterface>(this.itemComponent);
      // pass data to the component
    itemRef['item']= this.item
  }

}
