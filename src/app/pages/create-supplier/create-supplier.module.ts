import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateSupplierPage } from './create-supplier.page';
import { DynamicFormModule } from 'src/app/modules/dynamic-form/dynamic-form.module';

const routes: Routes = [
  {
    path: '',
    component: CreateSupplierPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DynamicFormModule,
    RouterModule.forChild(routes),
    RouterTestingModule.withRoutes([]),
  ],
  // declarations: [CreateSupplierPage]
})
export class CreateSupplierPageModule {}
