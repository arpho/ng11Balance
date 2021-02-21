import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateFidelityCardPageRoutingModule } from './update-fidelity-card-routing.module';

import { UpdateFidelityCardPage } from './update-fidelity-card.page';
import { DynamicFormModule } from 'src/app/modules/dynamic-form/dynamic-form.module';
import { BarcodeModule } from 'src/app/modules/barcode/barcode.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateFidelityCardPageRoutingModule,
    DynamicFormModule,
    BarcodeModule
  ],
  // declarations: [UpdateFidelityCardPage]
})
export class UpdateFidelityCardPageModule {}
