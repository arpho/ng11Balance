import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePaymentPage } from './create-payment.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePaymentPageRoutingModule {}
