import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { PaymentsModel } from 'src/app/models/paymentModel';
import { QuestionBase } from 'src/app/modules/dynamic-form/models/question-base';
import { TextboxQuestion } from 'src/app/modules/item/models/question-textbox';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import { timingSafeEqual } from 'crypto';
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';

@Component({
  selector: 'app-detail-payment',
  templateUrl: './detail-payment.page.html',
  styleUrls: ['./detail-payment.page.scss'],
})
export class DetailPaymentPage implements OnInit {
  payment: PaymentsModel
  titolo: string
  paymentsFields: Array<QuestionBase<string>>
  ngOnInit() {
    this.payment = this.navParams.get('item')
    if (this.payment && this.payment.title) {
      this.titolo = `dettaglio ${this.payment.title}`

      this.paymentsFields = [
        new TextboxQuestion({ key: 'title', label: 'nome del pagamento', value: this.payment.title, required: true }),
        new TextAreaBox({autoGrow:true, key: 'note', label: 'note', value: this.payment.note }),
        new TextboxQuestion({ key: 'addebito', label: 'codice addebito', value: this.payment.addebito })
      ]
    }
  }

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public service: PaymentsService,
    public toastCtrl: ToastController) {
  }
  filter(ev) {
  }

  async presentToast(args: { message: string, duration: number, next?: () => void, position?: string }) {
    const toast = await this.toastCtrl.create({
      header: 'pagamento aggiornato',
      message: args.message,
      duration: args.duration

    })
    toast.present().finally(args.next)
  }
  submit(ev) {
    Object.assign(this.payment, ev)
    const next = () => {
      return this.dismiss()
    }
    this.service.updateItem(this.payment).then(() => {
      this.presentToast({
        message: 'pagamento modificato correttamente',
        duration: 1500,
        position: 'top',
        next
      }).catch((err) => {
        console.log(err)
        this.presentToast({
          message: ' si è verificato un errore',
          duration: 1500,
          next
        })
      })

    })

  }

  dismiss() {
    this.modalCtrl.dismiss()
  }


}
