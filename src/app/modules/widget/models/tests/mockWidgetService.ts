import { ItemServiceInterface } from 'src/app/modules/item/models/ItemServiceInterface';
import { EntityWidgetServiceInterface } from '../EntityWidgetServiceInterface';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
import { WidgetOperation } from '../WidgetsTypes';

export class WidgetServiceMocker implements ItemServiceInterface, EntityWidgetServiceInterface {
    constructor() {
        this.items_list = []
    }
    instatiateItem: (args: {}) => ItemModelInterface;
    // entityKey: string;
    key = 'mockerService'
    entityLabel: string;
    filterableField: string;
    counterWidget = (entityKey: string, entities: ItemModelInterface[]) => WidgetOperation.Counter;
    adderWidget = (entityKey: string, entities: ItemModelInterface[]) => WidgetOperation.Adder;
    categoriesService?: ItemServiceInterface;
    suppliersService?: ItemServiceInterface;
    paymentsService?: ItemServiceInterface;
    suppliersListRef?: any;
    _items: import("rxjs").BehaviorSubject<ItemModelInterface[]>;
    items_list: ItemModelInterface[];
    items: import("rxjs").Observable<ItemModelInterface[]>;
    getItem(key: string): import("firebase").default.database.Reference {
        throw new Error("Method not implemented.");
    }
    updateItem(item: ItemModelInterface) {
        throw new Error("Method not implemented.");
    }
    deleteItem(key: string) {
        throw new Error("Method not implemented.");
    }
    getDummyItem(): ItemModelInterface {
        throw new Error("Method not implemented.");
    }
    createItem(item: ItemModelInterface): import("firebase").default.database.ThenableReference {
        throw new Error("Method not implemented.");
    }
    getEntitiesList(): import("firebase").default.database.Reference {
        throw new Error("Method not implemented.");
    }



}
