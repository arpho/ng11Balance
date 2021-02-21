// tslint:disable:semicolon
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { PaymentsModel } from 'src/app/models/paymentModel';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';


@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.page.html',
  styleUrls: ['./create-payment.page.scss'],
})
export class CreatePaymentPage implements OnInit {
  showSpinner = false
  payment: any
  paymentFields: any


  constructor(public modalCtrl: ModalController, private service: PaymentsService) {
    this.payment = this.service.getDummyItem()
    this.paymentFields = [
      new TextboxQuestion({
        key: 'title',
        label: 'Nome del pagamento',
        value: this.payment.title,
        order: 1
      }),
      new TextAreaBox({
        key: 'note',
        label: 'note',
        value: this.payment.note,
        order: 2,
        autoGrow:true
      }),
    ];

  }

  ngOnInit() {
  }

  filter(ev) {
  }
  dismiss(payment?) {
    this.modalCtrl.dismiss(payment)
  }

  submit(ev) {
    this.showSpinner = true

    this.payment.build(ev)
    
    this.service.createItem(this.payment).then( payment => {
      
        this.dismiss(payment)
    
    })

  }

}
