// tslint:disable: semicolon
import { ItemServiceInterface } from 'src/app/modules/item/models/ItemServiceInterface';
import { SupplierModel } from '../supplierModel';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';

export class MockSupplierService implements ItemServiceInterface {
    categoriesService?: ItemServiceInterface; suppliersService?: ItemServiceInterface;
    paymentsService?: ItemServiceInterface;
    _items: BehaviorSubject<Array<ItemModelInterface>> = new BehaviorSubject([])
    readonly items: Observable<Array<ItemModelInterface>> = this._items.asObservable()
    items_list: Array<ItemModelInterface> = []
    public suppliersListRef: firebase.database.Reference;
    getItem(key: string): any {
        const data = {
            address: {
                address: 'Via degli Imbriani, 63, 20158 Milano MI, Italia',
                latitude: 45.5018955,
                longitude: 9.1661847
            },
            altitude: '',
            ecommerce: false,
            fidelity_card: '',
            key: '-Ks7cQ3uf6Dpwq3RlsJz',
            nome: '',
            note: '',
            onLine: true,
        };
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
    updateItem(item: import('../../modules/item/models/itemModelInterface').ItemModelInterface) {
        throw new Error('Method not implemented.');
    }
    deleteItem(key: string) {
        throw new Error('Method not implemented.');
    }
    getDummyItem(): import('../../modules/item/models/itemModelInterface').ItemModelInterface {
        return new SupplierModel();
    }
    createItem(item: import('../../modules/item/models/itemModelInterface').ItemModelInterface):
        import('firebase').database.ThenableReference {
        throw new Error('Method not implemented.');
    }
    getEntitiesList(): import('firebase').database.Reference {
        throw new Error('Method not implemented.');
    }


}
