import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPaymentPage } from './edit-payment.page';

const routes: Routes = [
  {
    path: '',
    component: EditPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPaymentPageRoutingModule {}
