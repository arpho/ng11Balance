import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecoratorService } from './services/decorator-service.service';
import { OfflineStatusComponent } from './components/offline-status/offline-status.component';
import { IonicModule } from '@ionic/angular';
import { DecoratorFactoryService } from './services/decorator-factory.service';
import { ConnectionStatusService } from './services/connection-status.service';



@NgModule({
  declarations: [OfflineStatusComponent],
  exports:[OfflineStatusComponent],
  providers:[DecoratorService,DecoratorFactoryService,ConnectionStatusService],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    
  ],

})
export class OfflineModule { }
