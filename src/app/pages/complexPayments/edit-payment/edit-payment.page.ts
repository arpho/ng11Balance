import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ComplexPaymentModel } from 'src/app/models/ComplexPaymentModel';
import { ItemsList } from 'src/app/modules/dynamic-form/models/itemsList';
import { SelectorQuestion } from 'src/app/modules/dynamic-form/models/question-selector';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import {CreatePaymentPage} from '../../create-payment/create-payment.page'

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.page.html',
  styleUrls: ['./edit-payment.page.scss'],
})
export class EditPaymentPage implements OnInit {
  questions=[new TextboxQuestion({key:"title",label:"test"})]
payment:ComplexPaymentModel
  constructor(
    private modalCtrl:ModalController,
    private navParams:NavParams,
    public payments:PaymentsService
    ) { }

  ngOnInit() {
    const data  = this.navParams.get("data") as ItemsList
    this.payment = new ComplexPaymentModel().setKey(data.itemKey)
    this.payments.items.subscribe(items=>{
     this.payment.build( items.filter(p=>p.key== this.payment.key)[0])
    console.log("data",data,this.payment)
    this.questions = [
      new SelectorQuestion({
        label:"canale di pagamento",
      key:"payment",
      service:this.payments,
      text:"il canale di pagamento",
      value:this.payment,
      createPopup:CreatePaymentPage})
    ]
      
    })
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
