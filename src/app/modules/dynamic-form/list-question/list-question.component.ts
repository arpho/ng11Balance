import { Component, Input, OnInit } from '@angular/core';
import {  IonItemSliding, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.scss'],
})
export class ListQuestionComponent implements OnInit {
  @Input() itemsList:unknown[]
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
    const alert = await this.modalCtrl.create({component:this.editPage})
    await alert.present()
    slide.close()
  }

  async create(){
    console.log("popup",this.createPage)
    const alert = await this.modalCtrl.create({component:this.editPage})
    await alert.present()
  }

}
