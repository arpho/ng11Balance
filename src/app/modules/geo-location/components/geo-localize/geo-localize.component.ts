import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Plugins, GeolocationOptions } from '@capacitor/core';
//import { AgmCoreModule } from '@agm/core';
const { Geolocation } = Plugins;


@Component({
  selector: 'app-geo-localize',
  templateUrl: './geo-localize.component.html',
  styleUrls: ['./geo-localize.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoLocalizeComponent implements OnInit {

  constructor(/* public agm: AgmCoreModule */) { }

  async getCurrentPosition() {
    const options: GeolocationOptions = {};
    options.enableHighAccuracy = true;
    const coordinates = await Geolocation.getCurrentPosition(options);


  }

  ngOnInit() {
  }

}
