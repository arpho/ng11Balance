import { Injectable } from '@angular/core';
import { Plugins, GeolocationOptions, GeolocationPosition } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { configs } from '../../../configs/credentials';

export enum Status{
  cached = 'cached',
  fresh = 'fresh'
}
const { Geolocation } = Plugins;



@Injectable({
  providedIn: 'root'
})
export class GeoService {
  private timeoutExpired: boolean;
  private oldLocation: any;


  constructor(public http: HttpClient) {
    this.timeoutExpired = true;
  }

  distance(lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)) || 6371; // 2 * R; R = 6371 km  se NaN lo considero molto distante
  }


  makeUrl(lat, long) {
    return 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
      .concat(lat).concat(',').concat(long).concat('&key=').concat(configs.google.api_key);
  }

  inverseGeoLocation(lat, long) {
    const url = this.makeUrl(lat, long);
    return this.http.get(url);
  }
  /**
   *set a timeout
   @param t: number timeout in millisecs
   @boolean: returns true when   the timeout is set, otherwise return false
   *
   * @param {number} t
   * @returns
   * @memberof GeoService
   */
  setTimeout(t: number) {

    if (this.timeoutExpired) {
      setTimeout(() => {
        this.timeoutExpired = true;
      }, t);
      this.timeoutExpired = false;
      return true;
    } else {
      return false;
    }


  }

  async getPosition() {

    const options: GeolocationOptions = {};
    options.enableHighAccuracy = true;
    // set 5 min timeout
    if (this.setTimeout(300000)) {
      this.oldLocation = await Geolocation.getCurrentPosition(options);
      this.oldLocation.status =  Status.fresh
      return this.oldLocation;
    } else {
      const promise = new Promise((resolve, reject) => {
        this.oldLocation.status = Status.cached

        resolve(  this.oldLocation )
      })
      return promise;
    }
  }
}
