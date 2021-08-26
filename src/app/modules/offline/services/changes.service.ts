import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Items2Update } from '../models/items2Update';

@Injectable({
  providedIn: 'root'
})
export class ChangesService {
  _items: BehaviorSubject<Array<Items2Update>> = new BehaviorSubject([])
  readonly items: Observable<Array<Items2Update>> = this._items.asObservable()
  items_list: Array<Items2Update> = []


  constructor() { }
}
