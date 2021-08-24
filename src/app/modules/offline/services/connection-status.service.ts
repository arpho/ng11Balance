import { Injectable } from '@angular/core';
import { createStore, applyMiddleware } from 'redux' 
@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {

  constructor() { 

  // Define an initial state value for the app
const initialState = {
  value: navigator.onLine
  

}
function reducer(state= initialState,action){
  switch(action.type){
    case "connection/online":
      return{...state,value:navigator.onLine}
      case "connection/offline":
        return {...state,value:navigator.onLine}
        default:
          return state
  }// Create a new Redux store with the `createStore` function,
// and use the `reducer` for the update logic
const store = createStore(reducer)


}
  

}
}
