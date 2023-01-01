import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPaymentPageRoutingModule } from './edit-payment-routing.module';

import { EditPaymentPage } from './edit-payment.page';
import { DynamicFormModule } from 'src/app/modules/dynamic-form/dynamic-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DynamicFormModule,
    EditPaymentPageRoutingModule
  ],
  declarations: [EditPaymentPage]
})
export class EditPaymentPageModule {}
