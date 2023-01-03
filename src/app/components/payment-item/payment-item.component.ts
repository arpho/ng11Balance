import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-item',
  templateUrl: './payment-item.component.html',
  styleUrls: ['./payment-item.component.scss'],
})
export class PaymentItemComponent implements OnInit {
item= {title:"test",field2:"23€",field3:"02-01-2023"}
  constructor() { }

  ngOnInit() {}

}
