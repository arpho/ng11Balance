import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundPipe } from './pipes/round.pipe';



@NgModule({
  declarations:[RoundPipe],
  imports: [CommonModule],
  exports:[RoundPipe]
})
export class UtilitiesModule {

  static forRoot() {
    return {
      ngModule: UtilitiesModule,
      providers: [],
    };
  }
 }
