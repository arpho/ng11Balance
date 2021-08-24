import { Injectable } from '@angular/core';
import { createStore, applyMiddleware } from 'redux'
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
    function reducer(state = initialState, action) {
      console.log('reducer', state, action)
      switch (action.type) {
        case "connection/online":
          console.log('status switch', navigator.onLine)
          return { ...state, value: true }
        case "connection/offline":
          console.log('status switch', false)
          return { ...state, value: navigator.onLine }
        default:
          return state
      }



    }
    console.log('store*', this.store)

  }
  subscribeConnectionStatus(callback) {

    return this.store.subscribe(callback(navigator.onLine))
  }
  getStatus() {
    return navigator.onLine
  }
}
