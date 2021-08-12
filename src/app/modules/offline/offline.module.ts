import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecoratorService } from './services/decorator-service.service';



@NgModule({
  declarations: [],
  exports:[],
  providers:[DecoratorService],
  imports: [
    CommonModule
  ],

})
export class OfflineModule { }
