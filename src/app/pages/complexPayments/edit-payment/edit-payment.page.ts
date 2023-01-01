import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { database } from 'firebase-admin';
import { ComplexPaymentModel } from 'src/app/models/ComplexPaymentModel';
import { ItemsList } from 'src/app/modules/dynamic-form/models/itemsList';
import { QuestionBase } from 'src/app/modules/dynamic-form/models/question-base';
import { DateQuestion } from 'src/app/modules/dynamic-form/models/question-date';
import { SelectorQuestion } from 'src/app/modules/dynamic-form/models/question-selector';
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { DateModel } from 'src/app/modules/user/models/birthDateModel';
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
    this.questions = [
      new SelectorQuestion({
        label:"canale di pagamento",
      key:"payment",
      service:this.payments,
      text:"il canale di pagamento",
      value:this.payment,
      createPopup:CreatePaymentPage}),
      new DateQuestion({
        key:"date",
        label:"data del pagameto",
        value:new DateModel(new Date(data.field3)).formatDate()
      }),
      new TextboxQuestion({
        key:"amount",
      label:"importo",
      type:'number'
    }),
    new TextAreaBox({
      key:"note",
      label:"note"
    })
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
    const payment = new ComplexPaymentModel({paymentDate:ev.date,paymentKey:String(new Date().getTime()),amount:Number(ev.amount)}).setPayment(ev.payment)
    payment.note= ev.note
    
    console.log("complex",payment)
    this.dismiss(payment)
    
  }

}
