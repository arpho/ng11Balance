// tslint:disable:semicolon
import { AbstractControl, FormControl } from '@angular/forms';
import { ItemModelInterface, Genere } from '../modules/item/models/itemModelInterface';
import { ItemServiceInterface } from '../modules/item/models/ItemServiceInterface';
import { Value } from '../modules/item/models/value';
import { ItemFilterOPtions } from '../modules/item/models/ItemFIlterOptions';
import { QuickAction } from '../modules/item/models/QuickAction';
import { WidgetitemInteface } from '../modules/widget/models/widgetItemIterface';
import { OfflineItemModelInterface, offlineSerializer } from '../modules/offline/models/offlineItemModelInterface';
export class PaymentsModel implements OfflineItemModelInterface, WidgetitemInteface {
    nome: string; // retro compatibilità
    title: string;
    note: string;
    addebito: string;
    key: string;
    quickActions: Array<QuickAction>
    archived: boolean;
    constructor(
        payment?: {
            nome?: string,
            addebito: string,
            note: string
            key: string
        },
        // tslint:disable-next-line: align
        key?: string,
        // tslint:disable-next-line: align
        service?: ItemServiceInterface) {

        if (payment) {
            this.build(payment)
        }
        this.key = key || this.key


    }
    entityLabel="Pagamento"
    serialize4OfflineDb(): offlineSerializer<{ entityLabel: string; }> {
        const out = this.serialize()
        out['entityLabel']= this.entityLabel
        return out 
    }
    service?: ItemServiceInterface;
    isArchived?(): boolean {
        throw new Error('Method not implemented.');return this.archived
    }
    archiveItem?(b: boolean) {
        throw new Error('Method not implemented.');
    }
    isArchivable?(): boolean {
        return false
    }
    widgetText = `..`

    setKey(key:string){
        this.key= key
        return this
    }

    build(item) {
        this.key = item.key
        this.nome = item.nome 
        this.title = item.title || item.nome
        this.addebito = item.addebito
        this.note = item.note
        return this
    }

    clone(item) {
        this.title = item.tilte || item.title
        this.addebito = item.addebito
        this.note = item.note
        return this
    }

    getCountingText() {
        return ' metodi di pagamento'
    }

    getFilterParams() {
        const out: ItemFilterOPtions = new ItemFilterOPtions('categoria', 'text');
        return [out];
    }

    initialize(payment) {
        Object.assign(this, payment)
        this.widgetText = `pagata tramite ${this.title}`
        this.nome= payment.nome
        this.title = this.title || this.nome
        return this
    }
    async load() {

        return this
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
                        const filterFunction = (item: ItemModelInterface) => {
                            return this.title.toLowerCase().indexOf(data[0]) > -1;
                        };
                        next(filterFunction);
                    },
                },
            ],
        };
    }



    getEditPopup(item: ItemModelInterface, ) {

        return {
            subHeader: 'modifica pagamento',
            inputs: [
                {
                    type: 'text',
                    name: 'title',
                    placeholder: 'pagamento',
                    value: item.title,
                },
                {
                    type: 'text',
                    name: 'note',
                    placeholder: 'note',
                    value: item.note,
                },
            ],
            buttons: [
                { text: 'Annulla' },
                {
                    text: 'Salva',
                    handler: data => {
                        item.title = data.title;
                        item.note = data.note;
                    },
                },
            ],
        };
    }

    getQuickActions() {
        return this.quickActions
    }

    hasQuickActions() {
        return false
    }

    getElement() {
        const genere: Genere = 'o';
        return { element: 'metodo di pagamento', genere };
    }


    getTitle() {
        const value = new Value();
        value.label = 'pagamento';
        value.value = this.title || this.nome;
        return value;
    }

    getNote() {
        const value = new Value();
        value.label = 'note';
        value.value = this.note;
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
        value.value = 'to be implented';
        return value;
    }


    serialize() {
        return {
            title: this.title || '',
            addebito: this.addebito || '',
            note: this.note || '',
            key: this.key || ''
        };

    }
}
