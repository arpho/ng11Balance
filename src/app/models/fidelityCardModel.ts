import { ItemModelInterface, Genere } from '../modules/item/models/itemModelInterface';
import { ItemServiceInterface } from '../modules/item/models/ItemServiceInterface';
import { Value } from '../modules/item/models/value';

export class FidelityCardModel implements ItemModelInterface {
    title: string;
    note?: string;
    barcode: string
    key: string;
    quickActions?: import("../modules/item/models/QuickAction").QuickAction[];
    archived?: boolean;
    service?: ItemServiceInterface;
    constructor(card?: {}) {
        this.load(card)
    }


    isArchivable?(): boolean {
        return true
    }
    getValue2(): Value {
        return new Value({ value: this.note, label: 'note' })
    }
    getValue3(): Value {
        return new Value({ value: this.barcode, label: 'codice' })
    }
    getValue4(): Value {
        const value = new Value();
        return value;
    }
    getEditPopup(item?: ItemModelInterface, service?: ItemServiceInterface) {
        throw new Error("Method not implemented.");
    }
    getAggregate(): Value {
        throw new Error("Method not implemented.");
    }
    aggregateAction() {
        throw new Error("Method not implemented.");
    }
    hasQuickActions(): boolean {
        return false
    }

    getTitle(): Value {
        return new Value({label:'carta',value:this.title})
    }
    getCountingText(): string {
        return " carte fedeltà "
    }
    getNote(): Value {
        
        const value = new Value();
        value.label = 'note';
        value.value = this.note;
        return value;
    }
    build?(item: {}) {
        return this.load(item)
    }
    load(item) {
        Object.assign(this, item)
        return this
    }
    isArchived?(): boolean {
        return this.archived
    }
    archiveItem?(b: boolean) {
        this.archived = b
        return this
    }
    serialize() {
        return {
            title: this.title || '',
            barcode: this.barcode || '',
            note: this.note || '',
            archived: !!this.archived,
            key: this.key || ''
        }
    }
    getElement(): { element: string; genere: Genere; } {
        const genere: Genere = 'a';
        return { element: 'fidelity card', genere };
    }

}