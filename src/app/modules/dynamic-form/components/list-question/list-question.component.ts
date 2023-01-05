import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, forwardRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {  IonItemSliding, ModalController } from '@ionic/angular';
import { PaymentItemComponent } from 'src/app/components/payment-item/payment-item.component';
import { ComplexPaymentModel } from 'src/app/models/ComplexPaymentModel';
import { ItemHostDirective } from '../../directives/item-host.directive';
import { ItemsListInterface } from '../../models/itemlistInterface';
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
  @Input() itemComponent
  disabled= false
  @ViewChild(ItemHostDirective, {static: true}) itemHost!: ItemHostDirective;

  // tslint:disable-next-line: ban-types
  onChange: any = () => { };
  // tslint:disable-next-line: ban-types
  onTouched: any = () => { };
  get value() {
    return this.itemsList;
  }

  loadItemComponent(itemValue:unknown){
    const _viewContainerRef = this.itemHost.viewContainerRef;
    //removes all views in that container
    _viewContainerRef.clear();
    //Create an instance of the component
    const itemRef = _viewContainerRef.createComponent<ItemsListInterface>(this.itemComponent) 
    itemRef['item']=itemValue // pass data to the component
  }
  constructor(private modalCtrl:ModalController) { }
  writeValue(val: any): void {
    this.itemsList = val;
    this.onChange(val);
    this.onTouched();
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


  loaditemComponent(viewContainerRef: ViewContainerRef, itemComponent:any,data:unknown){
    const _viewContainerRef = this.itemHost.viewContainerRef;
     //removes all views in that container
    _viewContainerRef.clear();
  }
  ngOnInit() {
    
  }
  deleteItem(item,slide:IonItemSliding,i:number){
    console.log("deleting ",item,i)
    delete this.itemsList[i]
    this.writeValue([...this.itemsList])
    console.log("items list after delete",this.itemsList)
    slide.close()
  }

  async editItem(item,slide:IonItemSliding,i:number){
    const componentProps = {data:item}
    const modal = await this.modalCtrl.create({component:this.editPage,componentProps:componentProps})
    modal.onDidDismiss().then(result=>{
      this.itemsList[i]= result.data as ComplexPaymentModel
      this.writeValue(this.itemsList)
    })
    await modal.present()
    slide.close()
  }

  async create(){
    const modal = await this.modalCtrl.create({component:this.createPage})
    modal.onDidDismiss().then((result)=>{ 
      console.log("result",result)
      if(result.data){
        console.log("new payment",result.data)
      this.itemsList.push(result.data)
    console.log("items ist on create",this.itemsList)
    }
      this.writeValue(this.itemsList)
  
  })
    await modal.present()
  }

}
