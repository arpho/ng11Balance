import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateFidelityCardPageRoutingModule } from './create-fidelity-card-routing.module';

import { CreateFidelityCardPage } from './create-fidelity-card.page';
import { DynamicFormModule } from 'src/app/modules/dynamic-form/dynamic-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DynamicFormModule,
    CreateFidelityCardPageRoutingModule
  ],
  //  declarations: [CreateFidelityCardPage]
})
export class CreateFidelityCardPageModule {}
