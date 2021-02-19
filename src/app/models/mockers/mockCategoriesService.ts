import { ItemServiceInterface } from '../../modules/item/models/ItemServiceInterface';
import { CategoryModel } from '../CategoryModel';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
import { BehaviorSubject, Observable } from 'rxjs';

export class MockCategoriesService implements ItemServiceInterface {
    categoriesService?: ItemServiceInterface; suppliersService?: ItemServiceInterface;
    paymentsService?: ItemServiceInterface;
    _items: BehaviorSubject<Array<ItemModelInterface>> = new BehaviorSubject([])
    readonly items: Observable<Array<ItemModelInterface>> = this._items.asObservable()
    items_list: Array<ItemModelInterface> = []
    public categoriesListRef: firebase.database.Reference;
    getItem(key: string): any {
        const data = {
            a: { title: 'a' },
            b: { title: 'b' },
            c: { title: 'c' },
            D: { title: 'D' },
            e: { title: 'e' },
            alimenti: { title: 'alimenti' },
            vegetali: { title: 'vegetali', fatherKey: 'alimenti' },
            frutta: { title: 'frutta', fatherKey: 'vegetali' }
        };
        // tslint:disable: label-position
        // tslint:disable: no-unused-expression
        // tslint:disable:semicolon
        // return { val: () => { title: this.data[key] } }
        // tslint:disable: only-arrow-functions
        // tslint:disable-next-line: space-before-function-paren
        const val = function () {

            return data[key] ? { title: data[key].title, fatherKey: data[key].fatherKey } : undefined
        }
        const cat = { val }
        const on = (label: string, next) => next(cat)

        return { on }
    }
    createCategory() {
    }
    updateItem(item: import('../../modules/item/models/itemModelInterface').ItemModelInterface) {
        throw new Error('Method not implemented.');
    }
    deleteItem(key: string) {
        throw new Error('Method not implemented.');
    }
    getDummyItem(): import('../../modules/item/models/itemModelInterface').ItemModelInterface {
        return new CategoryModel()
    }
    createItem(item: import('../../modules/item/models/itemModelInterface').
        ItemModelInterface): import('firebase').database.ThenableReference {
        throw new Error('Method not implemented.');
    }
    getEntitiesList(): import('firebase').database.Reference {
        throw new Error('Method not implemented.');
    }


}
