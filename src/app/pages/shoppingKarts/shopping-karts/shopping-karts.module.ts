import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShoppingKartsPage } from './shopping-karts.page';
import { ItemModule } from 'src/app/modules/item/item.module';
import { DynamicFormModule } from 'src/app/modules/dynamic-form/dynamic-form.module';

const routes: Routes = [
  {
    path: '',
    component: ShoppingKartsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemModule,
    DynamicFormModule,
    RouterModule.forChild(routes)
  ],
   declarations: [ShoppingKartsPage]
})
export class ShoppingKartsPageModule {}
