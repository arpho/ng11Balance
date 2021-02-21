import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailShoppingKartPage } from './detail-shopping-kart.page';

const routes: Routes = [
  {
    path: '',
    component: DetailShoppingKartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  // declarations: [DetailShoppingKartPage]
})
export class DetailShoppingKartPageModule {}
