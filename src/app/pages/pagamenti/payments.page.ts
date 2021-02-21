import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../../services/payments/payments.service';
import { PaymentsModel } from '../../models/paymentModel';
import { ItemModelInterface } from '../../modules/item/models/itemModelInterface';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { SwitchQuestion } from 'src/app/modules/item/models/question-switch';
import { CreatePaymentPage } from '../create-payment/create-payment.page'
import { DetailPaymentPage } from '../detail-payment/detail-payment.page'

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  public filterLabel0 = 'filtra nome';
  public filterLabel1 = ' filtra nota';
  public paymentsList = Array<PaymentsModel>();
  public filterFields: any;
  public createModalPage = CreatePaymentPage
  public editModalPage = DetailPaymentPage

  public filterFunction: (item: ItemModelInterface) => Boolean;
  constructor(public payments: PaymentsService) {
    this.filterFields = [
      new TextboxQuestion({
        key: 'title',
        label: 'Filtra per argomento',
        order: 1
      }),
      new TextboxQuestion({
        key: 'note',
        label: 'filtra per note',
        order: 2
      })
    ];
  }


  ngOnInit() {
  }

  filter(event) {
    const filterTitle = event.title ?
      (item: ItemModelInterface) => item.title.toLowerCase().indexOf(event.title.toLowerCase()) !== -1 :
      (item: ItemModelInterface) => true; // se non filtro il campo title prendo tutto
    const filterNote = event.note ? (item: ItemModelInterface) => item.note.toLowerCase().indexOf(event.note.toLowerCase()) !== -1 :
      (item: ItemModelInterface) => true;
    const out = (item: ItemModelInterface) => filterNote(item) && filterTitle(item);
    return out;
  }



}
