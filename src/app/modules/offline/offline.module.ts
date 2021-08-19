import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecoratorService } from './services/decorator-service.service';
import { OfflineStatusComponent } from './components/offline-status/offline-status.component';



@NgModule({
  declarations: [OfflineStatusComponent],
  exports:[OfflineStatusComponent],
  providers:[DecoratorService],
  imports: [
    CommonModule
  ],

})
export class OfflineModule { }
