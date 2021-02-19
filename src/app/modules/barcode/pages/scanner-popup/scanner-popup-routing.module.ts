import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScannerPopupPage } from './scanner-popup.page';

const routes: Routes = [
  {
    path: '',
    component: ScannerPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScannerPopupPageRoutingModule {}
