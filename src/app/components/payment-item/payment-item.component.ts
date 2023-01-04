import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ComplexPaymentModel } from 'src/app/models/ComplexPaymentModel';

@Component({
  selector: 'app-payment-item',
  templateUrl: './payment-item.component.html',
  styleUrls: ['./payment-item.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PaymentItemComponent implements OnInit, OnChanges{
@Input() item:ComplexPaymentModel
  constructor() { 
    console.log("constructor of paymwnt item")
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes",changes)
  }

  ngOnInit() {
    console.log("payment",this.item)
  }

}
