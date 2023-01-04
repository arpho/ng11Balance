import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
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
@ViewChildren('itemHost', { read: ViewContainerRef }) itemHost!: ItemHostDirective;
  constructor() { }
   load(){

    const _viewContainerRef = this.itemHost['_results'][0]
      //removes all views in that container
      _viewContainerRef.clear();
      console.log("itemComponent",this.itemComponent)
      const itemRef = _viewContainerRef.createComponent<ItemsListInterface>(this.itemComponent);
      // pass data to the component
    itemRef['item']= this.item
  }

  ngAfterViewInit() {
    console.log('on after view init', this.itemHost);
    const ref = this.itemHost['_results'][0]
    console.log("ref",ref)
this.load()
  }

  ngOnInit() {
    console.log('on after  init', this.itemHost);
  }
}
