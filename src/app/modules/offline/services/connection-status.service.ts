import { Injectable } from '@angular/core';
import { createStore, applyMiddleware } from 'redux' 
import {reduxThunk} from 'redux-thunk'
@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {

  constructor() { 

    //we create the listener
    window.addEventListener("isOnline", e => { console.log(navigator.onLine); });
    // enable middleware
    const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
    // create store
    const store = createStoreWithMiddleware(reduxThunk);// reduxThunk just beacause I do not know what reducers are
    //adding listner
    function listenToWindowEvent(name, mapEventToAction) { 
      return function (dispatch) { function handleEvent(e) { dispatch(mapEventToAction(e)); } window.addEventListener(name, handleEvent); } 
    }

    function navigatorOnLine(e) {
       return { type: 'WEB_APP_ONLINE', payload: navigator.onLine };
       }
  }
}
