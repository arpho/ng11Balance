import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePaymentPageRoutingModule } from './create-payment-routing.module';

import { CreatePaymentPage } from './create-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePaymentPageRoutingModule
  ],
  declarations: [CreatePaymentPage]
})
export class CreatePaymentPageModule {}
