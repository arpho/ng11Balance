

// tslint:disable: semicolon
import { FirebaseObject } from './firebaseObject';
import { Genere } from '../modules/item/models/itemModelInterface';
import { Value } from '../modules/item/models/value';
import { ItemServiceInterface } from '../modules/item/models/ItemServiceInterface';
import { ItemFilterOPtions } from '../modules/item/models/ItemFIlterOptions';
import { CategoriesService } from '../services/categories/categorie.service';
import { WidgetitemInteface } from '../modules/widget/models/widgetItemIterface';
import { QuickAction } from '../modules/item/models/QuickAction';
import { OfflineItemModelInterface } from '../modules/offline/models/offlineItemModelInterface';
export class CategoryModel implements FirebaseObject, OfflineItemModelInterface, WidgetitemInteface {

    key: string;
    title: string;
    service: ItemServiceInterface;
    note: string;
    fatherKey: string;
    father: CategoryModel;
    widgetText = '..'

    constructor(key?: string,) {
        this.key = key

        // this.service = service
    }
    serialize4OfflineDb() {

        const out = this.serialize()
        out.entityLabel = this.entityLabel
        return out
    }
    entityLabel: string = "Categoria"
    serialize4Offline(): {} {
        throw new Error('Method not implemented.');
    }
    offlineKey: 'categories';
    dependeciesList: [string] = [''];
    signature: string;
    coherent: boolean;
    entityKey: string;
    hasDepencies(): boolean {
        return false
    }
    isCoherent(): boolean {
        return this.coherent
    }
    quickActions?: QuickAction[];
    archived?: boolean;
    isArchived?(): boolean {
        throw new Error('Method not implemented.');
    }
    archiveItem?(b: boolean) {
        this.archived = b
    }
    isArchivable?(): boolean {
        throw new Error('Method not implemented.');
    }
    build(obj: { title: string, key: string, service?: CategoriesService }) {
        this.title = obj.title;
        this.key = this.key || obj.key; if (obj.service) {
            // this.service = this.service || obj.service
        }

        return this
    }

    setKey(key: string) {
        this.key = key
        return this
    }

    hasQuickActions() {
        return false
    }
    load(cat: any) { // TODO to be removed
        this.title = cat.title
        this.father = cat.father
        if (this.service) {
            this.service.getItem(this.key, (item: CategoryModel) => {
                Object.assign(this, item)
            })


        } else {
            // this.title = 'non service'
        }
        return this
    }
    initialize(cat: any) {
        Object.assign(this, cat)
        this.widgetText = ` per  ${this.title}`
        this.title = this.title || 'deleted'




        return this
    }
    getCountingText() { return ' categorie'; }

    getFilterParams() {
        const out: ItemFilterOPtions = new ItemFilterOPtions('categoria', 'text');
        return [out];
    }

    getElement() {
        const genere: Genere = 'a';
        return { element: 'categoria', genere };
    }
    getTitle() {
        const value = new Value({ value: this.title, label: 'categoria' });
        value.label = 'categoria';
        value.value = this.title || '';
        return value;
    }

    getEditPopup(item: OfflineItemModelInterface, service: ItemServiceInterface) {

        return {
            subHeader: 'modifica categoria',
            inputs: [
                {
                    type: 'text',
                    name: 'title',
                    placeholder: 'categoria',
                    value: item.title,
                },
            ],
            buttons: [
                { text: 'Annulla' },
                {
                    text: 'Salva',
                    handler: data => {
                        item.title = data.title;
                        service.updateItem(item);
                    },
                },
            ],
        };
    }

    getCreatePopup(service: ItemServiceInterface) {
        const item = new CategoryModel();

        return {
            subHeader: 'modifica categoria',
            inputs: [
                {
                    type: 'text',
                    name: 'title',
                    placeholder: 'categoria',
                },
            ],
            buttons: [
                { text: 'Annulla' },
                {
                    text: 'Salva',
                    handler: data => {
                        item.title = data.title;
                        service.updateItem(item);
                    },
                },
            ],
        };
    }




    getFilterPopup(next) {

        return {
            subHeader: 'modifica categoria',
            inputs: [
                {
                    type: 'text',
                    name: 'title',
                    placeholder: 'cerca categoria',
                    value: 'test filter',
                },
            ],
            buttons: [
                { text: 'Annulla' },
                {
                    text: 'Salva',
                    handler: data => {
                        const filterFunction = (item: OfflineItemModelInterface) => {
                            return this.title.toLowerCase().indexOf(data[0]) > -1;
                        };
                        next(filterFunction);
                    },
                },
            ],
        };
    }


    getNote() {
        const value = new Value({ label: 'occorrenze', value: '' });
        value.label = 'occorrenze';
        value.value = '';
        return value;
    }

    aggregateAction() { }

    getValue2() {
        const value = new Value();
        return value;
    }

    getValue3() {
        const value = new Value();
        return value;
    }

    showDetail() {

    }

    getValue4() {
        const value = new Value();
        return value;
    }

    getAggregate() {
        const value = new Value();
        value.label = 'spesa complessiva';
        value.value = ' to be implented';
        return value;
    }


    getKey() {
        return this.key || '';
    }

    serialize() {
        var fatherKey = ''
        if (this.fatherKey) {
            fatherKey = this.fatherKey
        }
        if (this.father) {
            fatherKey = this.father.getKey()
        }
        return {
            title: this.title || '',
            key: this.key || '',
            entityLabel: this.entityLabel,
            fatherKey: fatherKey
        }
    }
    addCategory() {
        let out: Array<CategoryModel> = [this]
        if (this.father) {
            out = [this, ... this.father.addCategory()]
        }
        return out
    }

    afferTo() {
        /**
         *   used for sankey diagram
         *  @return string father.title if father is defined, 'total' if fater is not defined
         */
        return this.father ? this.father.title : 'total'
    }

}
