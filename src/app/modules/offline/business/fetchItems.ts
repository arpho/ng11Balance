import { BehaviorSubject, Observable } from 'rxjs'
import { PersistenceService } from '../services/persistence.service'

export class FetchItems {

    _items: BehaviorSubject<Array<{}>> = new BehaviorSubject([])
    readonly items: Observable<Array<{}>> = this._items.asObservable()
    constructor(public persistence: PersistenceService) {

    }

    async FetchAllItems(entityKey: string, cb?) {

/**@note items must have a field entityKey */
        this._items.subscribe(cb)


        const items = []


        const a = async (key) => {

            console.log ('this is the key',key)


            const item = await this.persistence.getItem(key).toPromise()


            if (item['entityKey'] && item.entityKey == entityKey) { items.push(item) }


            this._items.next(items)
        }
        this.persistence.keys().subscribe({


            next: a

        })
    }


    async FetchAllItems2(entityKey: string, storage, ch?) {
        
    }
}