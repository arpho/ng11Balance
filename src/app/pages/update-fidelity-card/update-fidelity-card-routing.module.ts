import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateFidelityCardPage } from './update-fidelity-card.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateFidelityCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateFidelityCardPageRoutingModule {}
