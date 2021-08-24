import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecoratorService } from './services/decorator-service.service';
import { OfflineStatusComponent } from './components/offline-status/offline-status.component';
import { IonicModule } from '@ionic/angular';
import { DecoratorFactoryService } from './services/decorator-factory.service';
import { OnlineStatusModule } from 'ngx-online-status';



@NgModule({
  declarations: [OfflineStatusComponent],
  exports:[OfflineStatusComponent],
  providers:[DecoratorService,DecoratorFactoryService],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    OnlineStatusModule
  ],

})
export class OfflineModule { }
