import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {  IonItemSliding, ModalController } from '@ionic/angular';
import { ItemsList } from '../../models/itemsList';

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
  disabled= false

  // tslint:disable-next-line: ban-types
  onChange: any = () => { };
  // tslint:disable-next-line: ban-types
  onTouched: any = () => { };
  get value() {
    return this.itemsList;
  }

  constructor(private modalCtrl:ModalController) { }
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
    
  }
  deleteItem(item,slide:IonItemSliding,i:number){
    console.log("deleting ",item,i)
    delete this.itemsList[i]
    slide.close()
  }

  async editItem(item,slide:IonItemSliding,i:number){
    const componentProps = {data:item}
    const alert = await this.modalCtrl.create({component:this.editPage,componentProps:componentProps})
    await alert.present()
    slide.close()
  }

  async create(){
    const alert = await this.modalCtrl.create({component:this.editPage})
    await alert.present()
  }

}
