import { Component, OnInit } from '@angular/core';
import Quagga from 'quagga';
// import { DECODER_LIVE_CONFIG } from '../../config/decoder-config';
import { scan } from 'rxjs/operators';
import { AudioService } from '../../services/audio.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-scanner-popup',
  templateUrl: './scanner-popup.page.html',
  styleUrls: ['./scanner-popup.page.scss'],
})
export class ScannerPopupPage implements OnInit {
public errorMessage
barcode:string
  constructor(private audio: AudioService,public modalCtrl:ModalController) {

    this.audio.preload('detected', '../assets/audio/barcode.wav')
    this.audio.preload('wrong', '../assets/audio/wrong.mp3')
   }

  ngOnInit() {
    Quagga.init({
      inputStream: {
        constraints: {
          facingMode: 'environment' // restrict camera type
        },
        area: { // defines rectangle of the detection
          top: '40%',    // top offset
          right: '0%',  // right offset
          left: '0%',   // left offset
          bottom: '40%'  // bottom offset
        },
      },
      decoder: {
        readers: ['ean_reader'] // restrict code types
      },
    },
      (err) => {
        if (err) {
          this.errorMessage = `QuaggaJS could not be initialized, err: ${err}`;
          this.audio.play('wrong')
        } else {
          Quagga.start();
          Quagga.onDetected((res) => {
            Quagga.stop()
            this.audio.play('detected')
            this.barcode = res.codeResult.code
            this.modalCtrl.dismiss({code:this.barcode,format:res.codeResult.format})
            

            // window.alert(`code: ${res.codeResult.code}`);
          })
        }
      });
  }

  dismiss() {
    this.modalCtrl.dismiss()
  }

}
