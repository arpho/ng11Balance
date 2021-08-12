import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { configs } from './configs/credentials';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import * as firebase from '@ionic-native/firebase';

import firebase from "firebase/app";
import { DecoratorService } from './modules/offline/services/decorator-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'profilo',
      url: '/users/profile',
      icon: 'person'
    },
    {
      title: 'Utenti',
      url: '/users/users',
      icon: 'people'
    },
    {
      title: 'Categorie',
      url: '/categorie',
      icon: 'pricetags'
    },
    {
      title: 'Pagamenti',
      url: '/pagamenti',
      icon: 'cash'
    },
    {
      title: 'Fornitori',
      url: '/fornitori',
      icon: 'people'
    },
    {
      title: 'Carrelli della spesa',
      url: '/shopping-karts',
      icon: 'cart'
    },
    {
      title: 'Fidelity cards',
      url: '/fidelityCards',
      icon: 'card'
    },
    {
      title: 'info',
      url: '/info/release',
      icon: 'information-circle'
    },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private platform: Platform,
    //private splashScreen: SplashScreen,
    //private statusBar: StatusBar,
    //private info: InfoService,
    // dS:DecoratorService
    ) {
      if (firebase.apps.length === 0) {
        firebase.initializeApp(configs.firebase);
    }

  
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      //this.splashScreen.hide();
    });
    // devo controllare perchè durante il routing ci sono condizioni che ripassano  da qui e ritorno alla home
    /* this.info.areThereNews().then(v => {
      if (v > 0) {
        this.info.navigateTo().then(path => {
          this.router.navigateByUrl(path);
        });
      }
    }); */
  }
}
