import { Component, Input, OnInit } from '@angular/core';
import {  IonItemSliding, ModalController } from '@ionic/angular';
import { ItemsList } from '../../models/itemsList';

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.scss'],
})
export class ListQuestionComponent implements OnInit {
  @Input() itemsList:ItemsList[]
  @Input() editPage
  @Input() createPage

  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {
    
  }
  deleteItem(item,slide:IonItemSliding,i:number){
    console.log("deleting ",item,i)
    slide.close()
  }

  async editItem(item,slide:IonItemSliding,i:number){
    console.log("editing ",item,i)
    console.log("popup",this.editPage)
    console.log("item",item)
    const componentProps = {data:item}
    const alert = await this.modalCtrl.create({component:this.editPage,componentProps:componentProps})
    await alert.present()
    slide.close()
  }

  async create(){
    console.log("popup",this.createPage)
    const alert = await this.modalCtrl.create({component:this.editPage})
    await alert.present()
  }

}
