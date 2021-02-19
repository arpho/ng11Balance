import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditWidgetPageRoutingModule } from './edit-widget-routing.module';

import { EditWidgetPage } from './edit-widget.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditWidgetPageRoutingModule
  ],
  // declarations: [EditWidgetPage]
})
export class EditWidgetPageModule {}
