import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateWidgetPageRoutingModule } from './create-widget-routing.module';

import { CreateWidgetPage } from './create-widget.page';
import { ItemModule } from 'src/app/modules/item/item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemModule,
    CreateWidgetPageRoutingModule
  ],
  // declarations: [CreateWidgetPage]
})
export class CreateWidgetPageModule {}
