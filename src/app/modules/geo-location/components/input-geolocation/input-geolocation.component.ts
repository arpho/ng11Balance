import { Component, OnInit, forwardRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder } from '@angular/forms';
import { Plugins, GeolocationOptions, GeolocationPosition } from '@capacitor/core';
const { Geolocation } = Plugins;
import { Coordinates } from '../../models/coordinates';
import { GeoService } from '../../services/geo-service';
import { AlertController } from '@ionic/angular';
import { AlertPromise } from 'selenium-webdriver';
import { values } from 'd3';

@Component({
  selector: 'input-geolocation',
  templateUrl: './input-geolocation.component.html',
  styleUrls: ['./input-geolocation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputGeolocationComponent),
    }
  ]
})
export class InputGeolocationComponent implements OnInit, ControlValueAccessor {
  public location: Coordinates;


  public addressForm: FormGroup

  private disabled = false;

  @Input() address: string;
  selectedAddress: any;
  testRadioOpen = false;
  // tslint:disable-next-line: ban-types
  private onChange: Function = (location: Coordinates) => { };
  // tslint:disable-next-line: ban-types
  private onTouch: Function = () => { };
  showSpinner = false

  constructor(
    public service: GeoService,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder) { }

  writeValue(value) {
    console.log('writing ', value)

    value = value || new Coordinates({ latitude: 0, longitude: 0, address: '' });
    this.address = value.address
    // if value is undefined it fails
    this.location = value;
    console.log('location', this.location
    )
    this.onChange(this.location);


  }

  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouch = fn;
  }
  async promptAddress(addressList: [string], coordinates: GeolocationPosition) {
    const alert = await this.alertCtrl.create({
      header: 'Seleziona l\'indirizzo',
      subHeader: 'indirizzi localizzati',
      buttons: ['Dismiss'],
      cssClass: 'custom-alert'
    });
    const inputs = [];
    const inputFactory = (address: string) => {
      inputs.push({ type: 'radio', label: address, value: address });
    };
    addressList.forEach(inputFactory);
    alert.inputs = inputs;
    alert.buttons = [{
      text: 'Ok',
      handler: (data: any) => {
        this.testRadioOpen = false;
        this.selectedAddress = data;
        this.writeValue(new Coordinates({ latitude: coordinates.coords.latitude, longitude: coordinates.coords.longitude, address: data }));
        this.onTouch()
      }
    }
    ];
    alert.present();
  }

  async geolocalize() {
    this.showSpinner = true
    const options: GeolocationOptions = {};
    options.enableHighAccuracy = true;

    const coordinates = await Geolocation.getCurrentPosition(options);
    this.service.inverseGeoLocation(coordinates.coords.latitude, coordinates.coords.longitude).subscribe((v: {}) => {
      // tslint:disable-next-line: no-string-literal
      this.showSpinner = false
      const address = v['results'].map(item => item['formatted_address']);
      const out = this.promptAddress(address, coordinates);
    });


    const myCoordinates = new Coordinates({
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
      address: this.location.address || 'where i am'
    });
    const location: Coordinates = new Coordinates(myCoordinates);
    this.writeValue(location);
  }

  // Allow the Angular form control to disable this input
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  ngOnInit() {
    this.location = new Coordinates({ latitude: 0, longitude: 0, address: 'via vatte' })

    this.addressForm = this.formBuilder.group({
      'address': this.location.address,
      'latitude': this.location.latitude,
      'longitude': this.location.longitude
    },
    )
    this.addressForm.valueChanges.subscribe(v => {
    })
  }

}
