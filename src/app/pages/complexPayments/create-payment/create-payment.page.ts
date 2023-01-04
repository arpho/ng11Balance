import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComplexPaymentModel } from 'src/app/models/ComplexPaymentModel';
import { QuestionBase } from 'src/app/modules/dynamic-form/models/question-base';
import { DateQuestion } from 'src/app/modules/dynamic-form/models/question-date';
import { SelectorQuestion } from 'src/app/modules/dynamic-form/models/question-selector';
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { DateModel } from 'src/app/modules/user/models/birthDateModel';
import { PaymentsService } from 'src/app/services/payments/payments.service';

@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.page.html',
  styleUrls: ['./create-payment.page.scss'],
})
export class CreatePaymentPage implements OnInit {
  payment:ComplexPaymentModel
  questions:QuestionBase<unknown>[]

  constructor(private modalCtrl:ModalController,
    private payments:PaymentsService) { }

  ngOnInit() {
    this.payment = new ComplexPaymentModel()
    this.questions = [
      new SelectorQuestion({
        label:"canale di pagamento",
      key:"payment",
      service:this.payments,
      text:"il canale di pagamento",
      value:this.payment,
      createPopup:CreatePaymentPage}),
      new DateQuestion({
        key:"paymentDate",
        label:"data del pagameto",
        value:this.payment.paymentDate.formatDate()}
      ),
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
  }
  filter(ev){
    console.log("typing",ev)
  }
  submit(ev){
    console.log("submit",ev)
    this.payment.initialize(ev)
  }

  dismiss(value?:unknown){
    this.modalCtrl.dismiss(value)
  }

}
