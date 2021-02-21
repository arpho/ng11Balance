import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CategoriePage } from './categorie.page';
import { DynamicFormModule } from 'src/app/modules/dynamic-form/dynamic-form.module';
import { ItemModule } from 'src/app/modules/item/item.module';

const routes: Routes = [
  {
    path: '',
    component: CategoriePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DynamicFormModule,
    ItemModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CategoriePage]
})
export class CategoriePageModule {}
