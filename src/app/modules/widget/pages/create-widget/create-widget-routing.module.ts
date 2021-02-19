import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateWidgetPage } from './create-widget.page';

const routes: Routes = [
  {
    path: '',
    component: CreateWidgetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateWidgetPageRoutingModule {}
