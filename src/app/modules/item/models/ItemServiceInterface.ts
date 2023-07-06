
// tslint:disable:semicolon
import * as firebase from 'firebase/app';
import { ItemModelInterface } from './itemModelInterface';
import { Observable, BehaviorSubject } from 'rxjs';
import { OfflineItemModelInterface } from '../../offline/models/offlineItemModelInterface';
export interface ItemServiceInterface {
    // extra service for complex models
    categoriesService?: ItemServiceInterface
    suppliersService?: ItemServiceInterface
    paymentsService?: ItemServiceInterface
    suppliersListRef?
    // items?: Observable<Array<ItemModelInterface>>
    _items: BehaviorSubject<Array<ItemModelInterface>> // = new BehaviorSubject([])
    items_list: Array<ItemModelInterface> // = []
/* public */ readonly items: Observable<Array<ItemModelInterface>> // = this._items.asObservable()

    /**get one item from firebase
     * @param key:string
     * @param next(item:itemModelInterface)=> void: optional callback function
     * @returns firebase.database reference
c
s     */
    getItem(key: string, next?: (item: ItemModelInterface) => void): Promise<ItemModelInterface>;
    /**
     * this method fetch the Item freom the off line db
     * @param key :string item's key
     * @return Promise<ItemModelInterface
     */
    getItemOffline(key: string): Promise<ItemModelInterface>
    /**
     * 
     * @param key : string key of the item
     * @return Promise<ItemModelInterface
     */
    getItemOnLine(key: string): Promise<ItemModelInterface>

    /**modifica un item su firebase
     * @param item: ItemModelInterface the item to update
     * @returns void
     */
    updateItem(item: ItemModelInterface);
    /** delete an item on firebase database
     * @param key: string the item's key
     */
    deleteItem(key: string);

    /** return a void item of the type handled by the service */
    getDummyItem(): OfflineItemModelInterface | ItemModelInterface;
    /**crea un item in firebase
     *
     */
    createItem(item: ItemModelInterface);

}
