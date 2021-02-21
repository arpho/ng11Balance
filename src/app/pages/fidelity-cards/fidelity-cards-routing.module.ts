import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FidelityCardsPage } from './fidelity-cards.page';

const routes: Routes = [
  {
    path: '',
    component: FidelityCardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FidelityCardsPageRoutingModule {}
