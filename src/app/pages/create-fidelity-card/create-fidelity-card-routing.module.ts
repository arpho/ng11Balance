import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateFidelityCardPage } from './create-fidelity-card.page';

const routes: Routes = [
  {
    path: '',
    component: CreateFidelityCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateFidelityCardPageRoutingModule {}
