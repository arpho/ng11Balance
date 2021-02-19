import {FirebaseObject} from './firebaseObject';
export class ItemModel implements FirebaseObject {
    id: string;
    prezzo: number;
    barcode: string;
    nome: string;
    descrizione: string;
    picture: string;
    categorieId: string[];
    tassoConversione: number;
    moneta: string;
    key: string;
    quantita: string;
    constructor(item?: any) {
        this.prezzo = 0;
        this.barcode = '';
        this.descrizione = '';
        this.picture = '';
        this.categorieId = [];
        this.tassoConversione = 1;
        this.moneta = '€';
        this.key = '';
        this.quantita = '';
    }

    serialize() {
    }

    load(key: string) { }
    build(item: any) {
        this.prezzo = item && item.prezzo || 0;
        this.barcode = item && item.barcode || '';
        this.categorieId = item && item.categorieId || [];
        this.descrizione = item && item.descrizione || '';
        this.picture = item && item.picture || '';
        this.categorieId = item && item.categorieId || [];
        this.tassoConversione = item && item.tassoConversione || 1;
        this.moneta = item && item.moneta || '€';
        this.key = item && item.key || '';
        this.id = item && item.id;
        this.quantita = item && item.quantita || '';
        return this;
    }
}
