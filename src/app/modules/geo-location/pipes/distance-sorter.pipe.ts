import { Pipe, PipeTransform } from '@angular/core';
import { SupplierModel } from '../../../models/supplierModel';


@Pipe({
  name: 'distanceSorter'
})
export class DistanceSorterPipe implements PipeTransform {

  public distance(lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }


  transform(value: [SupplierModel], location: { longitude: number, latitude: number }) { // gli oggetti in value devono implementare Geolocated
    if (value && location) {
      return value.sort((a: SupplierModel, b: SupplierModel) => {
        return this.distance(a.address.latitude, a.address.longitude, location.latitude, location.longitude) -
          this.distance(b.address.latitude, b.address.longitude, location.latitude, location.longitude);
      });
    } else {
      return value;
    }
  }
}



