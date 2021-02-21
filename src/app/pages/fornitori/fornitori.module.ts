import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FornitoriPage } from './fornitori.page';
import { ItemModule } from 'src/app/modules/item/item.module';
import { DynamicFormModule } from 'src/app/modules/dynamic-form/dynamic-form.module';
import { GeoLocationModule } from 'src/app/modules/geo-location/geo-location.module';

const routes: Routes = [
  {
    path: '',
    component: FornitoriPage
  }
];

@NgModule({
  imports: [
    ItemModule,
    DynamicFormModule,
    GeoLocationModule,
    CommonModule,
    FormsModule,
    ItemModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FornitoriPage]
})
export class FornitoriPageModule {}
