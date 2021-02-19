import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecoratorService } from './business/decoratorItemService';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[DecoratorService]
})
export class OfflineModule { 
  public constructor(service:DecoratorService){ // forces an instance to be created

  }
}
