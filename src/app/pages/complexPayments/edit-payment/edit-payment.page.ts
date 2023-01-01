import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.page.html',
  styleUrls: ['./edit-payment.page.scss'],
})
export class EditPaymentPage implements OnInit {
  questions=[new TextboxQuestion({key:"title",label:"test"})]

  constructor(private modalCtrl:ModalController,
    private navParams:NavParams) { }

  ngOnInit() {
    const data  = this.navParams.get("data")
    console.log("data",data)
  }
  dismiss(value?:unknown){
    this.modalCtrl.dismiss(value)
  }
  filter(ev){
    console.log("typing",ev)
  }

  submit(ev){
    console.log("submit",ev)
  }

}
