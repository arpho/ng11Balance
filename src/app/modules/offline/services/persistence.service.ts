import { Injectable } from '@angular/core';
import { JSONSchema, StorageMap } from '@ngx-pwa/local-storage';
import { filter, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  constructor(private storage: StorageMap) {
  }

  getItem(key: string, schema?: JSONSchema) {
    return this.storage.get(key, schema)
  }


  setItem(key: string, data: any, entityKey: string, schema?: JSONSchema) {
    return this.storage.set(this.makeKey(key, entityKey), data, schema)
  }
  makeKey(key: string, entityKey: string): string {
    return `${entityKey}_${key}`
  }

  has(key: string) {
    return this.storage.has(key)
  }

  deleteItem(key: string) {
    return this.storage.delete(key)
  }

  size() {
    return this.storage.size
  }

  keys() {
    return this.storage.keys()
  }

  clear() {
    return this.storage.clear()
  }
  private makePrefix(entityKey) {
    return `${entityKey}_`
  }

  async fetchItems(entityKey: string,cb) {
    const items = []
    const next = (v) => {
      items.push(v)
      console.log('filtered items', v, items)
    }
    const complete = () => {
      console.log('finished', items)
      cb(items)
    }
    this.storage.keys().pipe(filter((key) => key.startsWith(this.makePrefix(entityKey))), mergeMap((key) => this.storage.get(key))).subscribe({
      next: next,
    complete:complete})
  }  }