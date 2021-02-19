import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { configs } from './configs/credentials';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import * as firebase from '@ionic-native/firebase';

import firebase from "firebase/app";
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
      url: '/user/profile',
      icon: 'person'
    },
    {
      title: 'Utenti',
      url: '/user/users',
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
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private platform: Platform,
    //private splashScreen: SplashScreen,
    //private statusBar: StatusBar,
    //private info: InfoService,
    ) {

    this.initializeApp();{
  firebase.initializeApp(configs.firebase);
  if (!firebase.apps.length) {
    firebase.initializeApp(configs.firebase);
    console.log('firebase initialized')
    // const  cat = this.categoriesService.getDummyItem();
  }
  else{console.log('boh',firebase.apps.length)}
      // const  cat = this.categoriesService.getDummyItem();
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
