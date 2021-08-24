import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {

  constructor() { 

    //we create the listener
    window.addEventListener("isOnline", e => { console.log(navigator.onLine); });
  }
}
