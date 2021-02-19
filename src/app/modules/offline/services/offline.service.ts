import { Injectable } from '@angular/core';
import { OfflineItemModelInterface } from '../models/OffilineModelInterface';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  entityList:[OfflineItemModelInterface]

  constructor() { }
  registerEntity(entity:OfflineItemModelInterface){
    this.entityList.push(entity)
  }
  
}
