import { Injectable } from '@angular/core';
import { createStore, applyMiddleware } from 'redux'
import { SorterItemsPipe } from '../../item/pipes/sorter-items.pipe';
@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {
  store
  status

  constructor() {

    // Define an initial state value for the app
    const initialState = {
      value: navigator.onLine


    }

    
    function updateOnlineStatus(event) {
      this.status = navigator.onLine ? "online" : "offline";
      if (navigator.onLine) {
        store.dispatch({ type: "connection/online" })
      }
      else {
        store.dispatch({ type: "connection/offline" })
      }
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Create a new Redux store with the `createStore` function,
    // and use the `reducer` for the update logic
    const store = createStore(reducer)
    this.store = store


    if(navigator.onLine){
      console.log('dispatchiong')
      store.dispatch({type:'connection/online'})
    }

    else{
      store.dispatch({type:'connection/offline'})
    }

    function reducer(state = initialState, action) {
      switch (action.type) {
        case "connection/online":
          console.log('status switch', navigator.onLine)
          return { ...state, value: navigator.onLine }
        case "connection/offline":
          console.log('status switch', false)
          return { ...state, value: navigator.onLine }
        default:
          return state
      }



    }
  }
  monitor(callback) {
    const out =  this.store.subscribe(()=>{
      console.log('monitor triggered')
      return callback(navigator.onLine)})
    return out
  }
  getStatus() {
    return navigator.onLine
  }
}
