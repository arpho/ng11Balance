import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
//import { AgmCoreModule } from '@agm/core';
import { GeoLocalizeComponent } from './components/geo-localize/geo-localize.component';
import { AgmComponent } from './components/agm/agm.component';
import { DistanceSorterPipe } from './pipes/distance-sorter.pipe';
import { GeoService } from './services/geo-service';
import { configs } from '../../configs/credentials';
import { InputGeolocationComponent } from './components/input-geolocation/input-geolocation.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GeoLocalizeComponent,
    AgmComponent,
    DistanceSorterPipe,
    InputGeolocationComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,


    IonicModule.forRoot(),
    /* AgmCoreModule.forRoot({
      apiKey: configs.google.api_key
    }), */
    HttpClientModule
  ],
  exports: [GeoLocalizeComponent, AgmComponent, DistanceSorterPipe, InputGeolocationComponent],

})
export class GeoLocationModule { }
