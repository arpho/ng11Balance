import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailCategoryPage } from './detail-category.page';
import { DynamicFormModule } from 'src/app/modules/dynamic-form/dynamic-form.module';

const routes: Routes = [
  {
    path: '',
    component: DetailCategoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DynamicFormModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  // declarations: [DetailCategoryPage]
})
export class DetailCategoryPageModule {}
