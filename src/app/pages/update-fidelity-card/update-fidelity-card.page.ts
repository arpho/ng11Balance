import { Component, OnInit } from '@angular/core';
import { CreateFidelityCardPage } from '../create-fidelity-card/create-fidelity-card.page';
import { NavParams, ModalController } from '@ionic/angular';
import { FidelityCardService } from 'src/app/services/fidelity-card.service';
import { QuestionBarcode } from 'src/app/modules/dynamic-form/models/question-barcode';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';

@Component({
  selector: 'app-update-fidelity-card',
  templateUrl: '../create-fidelity-card/create-fidelity-card.page.html',
  styleUrls: ['./update-fidelity-card.page.scss'],
})
export class UpdateFidelityCardPage extends CreateFidelityCardPage implements OnInit {



  constructor(public modalCtrl: ModalController, public service: FidelityCardService, public navParams: NavParams) {
    super(modalCtrl, service)



  }

  ngOnInit() {
    this.card = this.navParams.get('item')
    console.log('updating card', this.card)
    if (this.card) {
      this.title = `modifica carta ${this.card.title}`
    }
    this.cardFields = [
      new QuestionBarcode({
        key: 'barcode',
        label: 'codice a barre',
        value: this.card && this.card.barcode,
        order: 2
      }),
      new TextboxQuestion({
        key: 'title',
        label: 'titolo',
        order: 3,
        required: true,
        value: this.card && this.card.title
      }),
      new TextAreaBox({
        key: 'note',
        label: 'note',
        value: this.card && this.card.note,
        autoGrow: true,
        order: 1
      }),

    ]
  }


  submit(card) {
    this.card.load(card)
    this.service.updateItem(this.card).then(v => {
      this.dismiss(v)
    })
  }

}
