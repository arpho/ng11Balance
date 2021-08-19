import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { ItemModule } from '../modules/item/item.module';
import { OfflineModule } from '../modules/offline/offline.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    ItemModule,
    OfflineModule
  ],
  declarations: [FolderPage],
})
export class FolderPageModule {}
File