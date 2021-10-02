import { Component, OnInit } from '@angular/core';
import { FidelityCardsPageModule } from '../fidelity-cards/fidelity-cards.module';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { FidelityCardModel } from 'src/app/models/fidelityCardModel';
import { ModalController } from '@ionic/angular';
import { QuestionBarcode } from 'src/app/modules/dynamic-form/models/question-barcode';
import { FidelityCardService } from 'src/app/services/fidelityCards/fidelity-card.service';
import { TextAreaBox } from 'src/app/modules/dynamic-form/models/question-textArea';

@Component({
  selector: 'app-create-fidelity-card',
  templateUrl: './create-fidelity-card.page.html',
  styleUrls: ['./create-fidelity-card.page.scss'],
})
export class CreateFidelityCardPage implements OnInit {
  card= new FidelityCardModel()
  title = ' aggiungi fidelity card'
  cardFields = [
    new QuestionBarcode({
      key:'barcode',
      label:'codice a barre',
      value:this.card.barcode,
      order:2
    }),
    new TextboxQuestion({
      key: 'title',
      label: 'titolo',
      order: 3,
      required: true,
      value: this.card.title
    }),
    new TextAreaBox({
      key: 'note',
      label: 'note',
      autoGrow:true,
      value: this.card.note,
      order: 1
    }),
   
  ]


  constructor(public modalCtrl:ModalController,public service: FidelityCardService) {
  }

 ngOnInit() {
   
 }

  filter(v) {
  }
  submit(v) {
    console.log('submit', v)
    this.card = new FidelityCardModel(v)
    console.log('creating',this.card)
    this.service.createItem(this.card).then(v=>{
      this.dismiss(v)
    
  })
  }



  dismiss(card?) {
    this.modalCtrl.dismiss(card)
  }

}
