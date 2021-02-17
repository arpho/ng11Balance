import { Component } from '@angular/core';
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
  constructor() {}
}
