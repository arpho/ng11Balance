
// tslint:disable: semicolon
// tslint:disable: no-string-literal
import { FormControl } from '@angular/forms';
import { ItemModelInterface, Genere } from '../modules/item/models/itemModelInterface';
import { ItemFilterOPtions } from '../modules/item/models/ItemFIlterOptions';
import { ItemServiceInterface } from '../modules/item/models/ItemServiceInterface';
import { Value } from '../modules/item/models/value';
import { FirebaseObject } from '../models/firebaseObject';
import { Coordinates } from '../modules/geo-location/models/coordinates';
// import { FornitoriPage } from '../pages/fornitori/fornitori.page';
import { QuickAction } from '../modules/item/models/QuickAction';
import { ModalController, AlertController } from '@ionic/angular';
import { Geolocatated } from '../modules/geo-location/models/geolocationInterface';
import { WidgetitemInteface } from '../modules/widget/models/widgetItemIterface';
import { OfflineItemModelInterface, offlineSerializer } from '../modules/offline/models/offlineItemModelInterface';
export class SupplierModel implements OfflineItemModelInterface,WidgetitemInteface, FirebaseObject,Geolocatated {
    nome: string;
    note: string;
    indirizzo: string;
    address: Coordinates;
    latitudine: string;
    longitudine: string;
    latitude: number;
    longitude: number;
    altitude: string;
    title: string;
    // tslint:disable-next-line: variable-name
    fidelity_card: string;
    key: string;
    ecommerce: boolean;
    // tslint:disable-next-line: semicolon
    personaFisica: boolean
    cliente: boolean
    onLine: boolean; // back compatibility
    // tslint:disable: semicolon
    quickActions: Array<QuickAction>


    constructor(fornitore?: {
        nome: string,
        note: string,
        title?: string,
        fidelity_card?: string,
        address?: {

            address: string,
            latitude: number,
            longitude: number,
            indirizzo?: string
        }
        altitude?: string,
        key: string,
        ecommerce: boolean,


    },
        // tslint:disable-next-line: align
        key?: string) {
        this.quickActions = [

        ]
        if (fornitore) {
            Object.entries(fornitore).forEach(([Key, value]) => {
                this[Key] = fornitore[Key]
            })
            // defisco i campi che possono essere cambiate per back compatibility
            this.personaFisica = this.personaFisica || fornitore['personaFisica']
            this.cliente = this.cliente || fornitore['cliente']
            this.title = this.title || this.nome
            if (this.address) {
                this.address =
                    new Coordinates({ latitude: this.address.latitude, longitude: this.address.longitude, address: this.address.address })
            } else {
                this.address
                    = new Coordinates({ latitude: this.latitude, longitude: this.longitude, address: this.indirizzo })
            }
        }
        if (key) {
            this.key = key
        }

    }
    entityLabel: string="fgornitore"
    serialize4OfflineDb(): offlineSerializer<{ entityLabel: string; }> {
        const entityLabel = this.entityLabel
       return{... this.serialize(),entityLabel}
    }
    archived?: boolean;
    service?: ItemServiceInterface;
    isArchived?(): boolean {
        throw new Error('Method not implemented.');
    }
    archiveItem?(b: boolean) {
        throw new Error('Method not implemented.');
    }
    isArchivable?(): boolean {
        throw new Error('Method not implemented.');
    }
    widgetText = `..`
    initialize(supplier) {
        Object.assign(this, supplier)
        this.widgetText = ` comprato presso ${this.title}`
        this.title = this.title || this.nome
        this.address = new  Coordinates(this.address)
        return this
    }



    getQuickActions() {
        return this.quickActions
    }

    getCountingText() {
        return ' fornitori'
    }

    load(next?: () => void) {
        
        return this
    }

    getFilterParams() {
        const out: ItemFilterOPtions = new ItemFilterOPtions('fornitore', 'text');
        return [out];
    }

    getElement() {
        const genere: Genere = 'o';
        return { element: 'fornitore', genere };
    }
    getTitle() {
        const value = new Value();
        value.label = 'fornitore';
        value.value = this.title || this.nome || '';
        return value;
    }

    hasQuickActions() {
        return false;
    }


    build(item) {
        this.key = this.key || item.key
        // this.nome = item.nome || '';
        this.title = item.title || item.nome
        this.note = item.note || '';
        this.cliente = item.cliente
        this.personaFisica = item.personaFisica
        this.address = new Coordinates().clone(item.address)
        this.ecommerce = item.ecommerce;
        return this
    }
    setKey(key: string) {
        this.key = key
        return this
    }
    buildFromActiveForm(fornitore: {
        nome: FormControl,
        note: FormControl,
        key: FormControl,
        indirizzo: FormControl,
        longitudine: FormControl,
        altitude: FormControl,
        latitudine: FormControl,
        ecommerce: FormControl
    }) {
        this.key = fornitore && fornitore.key.value || '';
        this.nome = fornitore && fornitore.nome.value || '';
        this.note = fornitore && fornitore.note.value || '';
        this.altitude = fornitore && fornitore.altitude && fornitore.altitude.value || '';
        this.indirizzo = fornitore && fornitore.indirizzo.value || '';
        this.latitudine = fornitore && fornitore.latitudine.value || '';
        this.longitudine = fornitore && fornitore.longitudine.value || '';
        this.ecommerce = fornitore && fornitore.ecommerce.value || false;

        return this;
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
        value.label = 'fidelity card';
        value.value = this.fidelity_card;
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


    serialize() {
        return {
            title: this.title || '',
            address: this.address.serialize(),
            ecommerce: Boolean(this.ecommerce),
            cliente: Boolean(this.cliente),
            personaFisica: Boolean(this.personaFisica),
            key:this.key||'',
            fidelity_card: this.fidelity_card || '',
            note: this.note || ''

        };
    }

    getEditPopup() {

        return 'supplierUpdate';
    }


    getFilterPopup(next) {

    }

}
