import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecoratorService } from './services/decorator-service.service';
import { OfflineStatusComponent } from './components/offline-status/offline-status.component';
import { IonicModule } from '@ionic/angular';
import { ConnectionStatusService } from './services/connection-status.service';



@NgModule({
  declarations: [OfflineStatusComponent],
  exports: [OfflineStatusComponent],
  providers: [DecoratorService, ConnectionStatusService],
  imports: [
    CommonModule,
    IonicModule.forRoot(),

  ],

})
export class OfflineModule { }
