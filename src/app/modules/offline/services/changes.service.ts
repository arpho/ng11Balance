import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { items2Update } from '../models/items2Update';

@Injectable({
  providedIn: 'root'
})
export class ChangesService {
  _items: BehaviorSubject<Array<items2Update>> = new BehaviorSubject([])
  readonly items: Observable<Array<items2Update>> = this._items.asObservable()
  items_list: Array<items2Update> = []


  constructor() { }
}
