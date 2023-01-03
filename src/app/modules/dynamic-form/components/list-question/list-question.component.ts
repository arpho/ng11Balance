import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, forwardRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {  IonItemSliding, ModalController } from '@ionic/angular';
import { ItemHostDirective } from '../../directives/item-host.directive';
import { ItemsList } from '../../models/itemsList';
//import {} from '../../../../components/payment-item/payment-item.component'

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.scss'],
 changeDetection:ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => ListQuestionComponent)
  }]
})
export class ListQuestionComponent implements OnInit, ControlValueAccessor {
  @Input() itemsList:ItemsList[]
  @Input() editPage
  @Input() createPage
  @Input() itemComponentPath
  disabled= false

  // tslint:disable-next-line: ban-types
  onChange: any = () => { };
  // tslint:disable-next-line: ban-types
  onTouched: any = () => { };
  get value() {
    return this.itemsList;
  }
@ViewChild(ItemHostDirective, {static:true}) itemHost:ItemHostDirective
  constructor(private modalCtrl:ModalController,
    private componentFactoryResolver:ComponentFactoryResolver) { }
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled
  }

  set value(val) {
    this.itemsList = val;
    this.onChange(val);
    this.onTouched();
  }

  ngOnInit() {
    const vcr =this.componentFactoryResolver.resolveComponentFactory(this.itemComponentPath)
    console.log("init",vcr,this.itemComponentPath)
    const viewContainerRef =this.itemHost.viewContainerRef
    
  }
  deleteItem(item,slide:IonItemSliding,i:number){
    console.log("deleting ",item,i)
    delete this.itemsList[i]
    this.writeValue([...this.itemsList])
    slide.close()
  }

  async editItem(item,slide:IonItemSliding,i:number){
    const componentProps = {data:item}
    const modal = await this.modalCtrl.create({component:this.editPage,componentProps:componentProps})
    await modal.present()
    slide.close()
  }

  async create(){
    const modal = await this.modalCtrl.create({component:this.editPage})
    await modal.present()
  }

}
