import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { OfflineManagerService } from '../../services/offline-manager.service';

@Component({
  selector: 'app-offline-status',
  templateUrl: './offline-status.component.html',
  styleUrls: ['./offline-status.component.scss'],
})
/**subscribe to offlineStatus field in offlineManager */
export class OfflineStatusComponent implements OnInit {
  status = OfflineManagerService.offlineDbStatus

  constructor(public alertController:AlertController) {

  }

  ngOnInit() { }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Sei sicuro di voler syncronizzare il   <strong>Db locale?</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'sincronizza',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }


  refresh() {
    this.presentAlertConfirm()
  }
}
