import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditWidgetPage } from './edit-widget.page';

const routes: Routes = [
  {
    path: '',
    component: EditWidgetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditWidgetPageRoutingModule {}
