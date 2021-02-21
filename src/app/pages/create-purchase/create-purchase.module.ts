import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreatePurchasePage } from './create-purchase.page';
import { DynamicFormModule } from 'src/app/modules/dynamic-form/dynamic-form.module';

const routes: Routes = [
  {
    path: '',
    component: CreatePurchasePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DynamicFormModule,
    RouterModule.forChild(routes)
  ],
  // declarations: [CreatePurchasePage]
})
export class CreatePurchasePageModule {}
