import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPaymentPageRoutingModule } from './edit-payment-routing.module';

import { EditPaymentPage } from './edit-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPaymentPageRoutingModule
  ],
  declarations: [EditPaymentPage]
})
export class EditPaymentPageModule {}
