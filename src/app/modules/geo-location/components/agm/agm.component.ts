import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
//import { AgmCoreModule } from '@agm/core';

@Component({
  selector: 'my-agm-map',
  templateUrl: './agm.component.html',
  styleUrls: ['./agm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgmComponent implements OnInit {

  title = 'My first AGM project';
  lat = 37.7456284;
  lng = 15.146945299999999;
  locationChoosen = false;

  latitude: 0;

  longitude: 15.146945299999999;



  constructor(/* public agm: AgmCoreModule */) {


  }
  chooseLocation(ev) {
    this.lat = ev.coords.lat;
    this.lng = ev.coords.lng;
    this.locationChoosen = true;
  }

  ngOnInit() {
  }

}
