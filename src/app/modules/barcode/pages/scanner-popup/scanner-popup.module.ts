import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScannerPopupPageRoutingModule } from './scanner-popup-routing.module';

import { ScannerPopupPage } from './scanner-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScannerPopupPageRoutingModule
  ],
  declarations: []
})
export class ScannerPopupPageModule {}
