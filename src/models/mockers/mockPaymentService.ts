// tslint:disable:semicolon
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
import { ItemServiceInterface } from 'src/app/modules/item/models/ItemServiceInterface';
import { PaymentsModel } from '../paymentModel';
import { BehaviorSubject, Observable } from 'rxjs';

export class MockPaymentService implements ItemServiceInterface {
    categoriesService?: ItemServiceInterface; suppliersService?: ItemServiceInterface;
    _items: BehaviorSubject<Array<ItemModelInterface>> = new BehaviorSubject([])
    readonly items: Observable<Array<ItemModelInterface>> = this._items.asObservable()
    items_list: Array<ItemModelInterface> = []
    paymentsService?: ItemServiceInterface;
    public categoriesListRef: firebase.database.Reference;


    getItem(key: string): any {
        const data = { key: '123', title: 'qwertyu', note: 'asdfghj', addebito: '12/05/2019', nome: 'cash' };
        // tslint:disable: label-position
        // tslint:disable: no-unused-expression
        // tslint:disable:semicolon
        // return { val: () => { title: this.data[key] } }
        // tslint:disable-next-line: only-arrow-functions
        const val = function() {
            return data
        }
        const cat = { val }
        const on = (label: string, next) => next(cat)

        return { on }
    }

    updateItem(item: ItemModelInterface) {
        throw new Error('Method not implemented.');
    }
    deleteItem(key: string) {
        throw new Error('Method not implemented.');
    }
    getDummyItem(): ItemModelInterface {
        return new PaymentsModel()
    }
    createItem(item: ItemModelInterface): import('firebase').database.ThenableReference {
        throw new Error('Method not implemented.');
    }
    getEntitiesList(): import('firebase').database.Reference {
        throw new Error('Method not implemented.');
    }


}
