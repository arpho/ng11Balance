
// tslint:disable:semicolon
import * as firebase from 'firebase/app';
import { ItemModelInterface } from './itemModelInterface';
import { Observable, BehaviorSubject } from 'rxjs';
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
     * @returns firebase.database reference
     */
    getItem(key: string): firebase.default.database.Reference;

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
    getDummyItem(): ItemModelInterface;
    /**crea un item in firebase
     *
     */
    createItem(item: ItemModelInterface);

}
