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
