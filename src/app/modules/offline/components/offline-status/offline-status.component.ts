import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { OfflineManagerService } from '../../services/offline-manager.service';

@Component({
  selector: 'app-offline-status',
  templateUrl: './offline-status.component.html',
  styleUrls: ['./offline-status.component.scss'],
})
/**subscribe to offlineStatus field in offlineManager */
export class OfflineStatusComponent implements OnInit, OnDestroy {
  status = OfflineManagerService.offlineDbStatus
  msgSubscription: Subscription

  constructor(public alertController: AlertController, public manager: OfflineManagerService, public toastController: ToastController) {
    this.msgSubscription = manager.msg.subscribe(msg => {
      console.log('showing',msg)
      this.presentToast(msg)
    })
  }

  ngOnInit() { }
  ngOnDestroy() {
    this.msgSubscription.unsubscribe()

  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position:'top'
    });
    console.log('presenting toast',msg)
    toast.present();
  }


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
            this.manager.rebaseDb()
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
