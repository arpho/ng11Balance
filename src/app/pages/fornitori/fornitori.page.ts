// tslint:disable:semicolon
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SuppliersService } from '../../services/suppliers/suppliers.service';
// import { CategoryModel } from 'src/app/models/CategoryModel';
import { ItemModelInterface } from 'src/app/modules/item/models/itemModelInterface';
import { SupplierModel } from 'src/app/models/supplierModel';
import { Router } from '@angular/router';
import { GeoService } from '../../modules/geo-location/services/geo-service';
import { TextboxQuestion } from 'src/app/modules/dynamic-form/models/question-textbox';
import { SwitchQuestion } from 'src/app/modules/item/models/question-switch';
import { ItemControllerInterface } from '../../modules/item/models/ItemControllerInterface'
import { ViewSupplierPage } from '../view-supplier/view-supplier.page'
import { CreateSupplierPage } from '../create-supplier/create-supplier.page';

@Component({
  selector: 'app-fornitori',
  templateUrl: './fornitori.page.html',
  styleUrls: ['./fornitori.page.scss'],
})
export class FornitoriPage implements OnInit, OnChanges, ItemControllerInterface {
  public ItemsList: [SupplierModel]
  public filterLabel = 'Categorie';
  public filterString: string;
  public filterFields: any;
  public filterFunction: (item: SupplierModel) => boolean;
  public sorterFunction: (a: any, b: any) => number
  public position = { latitude: 0, longitude: 0 };
  public createModalPage = CreateSupplierPage
  public editModalPage = ViewSupplierPage

  constructor(
    public suppliers: SuppliersService,
    public geo: GeoService,
    public router: Router, ) {
    this.filterFields = [
      new TextboxQuestion({
        key: 'title',
        label: 'Nome del Fornitore',
        // value: 'Bombasto',
        order: 1
      }),
      new TextboxQuestion({
        key: 'note',
        label: 'note',
        // value: 'Bombasto',
        order: 2
      }),
      new SwitchQuestion({
        key: 'ecommerce',
        label: 'venditore online',
        labelTrue: 'venditore fa ecommerce',
        labelFalse: ' venditore tradizionale',
        iconTrue: 'wifi',
        iconFalse: 'cash',
        required: false,
        order: 4
      }),
      new SwitchQuestion({
        key: 'cliente',
        label: 'cliente/fornitore',
        labelTrue: 'cliente',
        labelFalse: ' fornitore',
        iconTrue: 'happy',
        iconFalse: 'hammer',
        required: false,
        order: 5
      }),
      new SwitchQuestion({
        key: 'personaFisica',
        label: 'persona',
        labelTrue: 'fisica',
        labelFalse: ' fiscale',
        iconTrue: 'man',
        iconFalse: 'business',
        required: false,
        order: 6
      }),
    ];

  }


  filter(filterParams: any) { // è possibile filtrare per titolo, nota  e ecommerce
    if (filterParams) {
      const filterTitle: (item: ItemModelInterface) => boolean = (!filterParams.title) ? (item: ItemModelInterface) => true :
        (item: ItemModelInterface) => (item.title)? item.title.toLocaleLowerCase().includes(filterParams.title.toLowerCase()):false;
      const filterNote = (!filterParams.note) ? (item: ItemModelInterface) => true :
        (item: ItemModelInterface) => item.note.toLocaleLowerCase().indexOf(filterParams.note.toLowerCase()) > -1;
      this.filterFunction = (item: ItemModelInterface) => filterNote(item) && filterTitle(item);
      const filterEcommerce: (item: ItemModelInterface) => boolean = (!filterParams.ecommerce) ? (item: ItemModelInterface) => true :
        (item: SupplierModel) => item.ecommerce;
      // combina le funzioni filtro elementari
      this.filterFunction = (item: ItemModelInterface) => filterEcommerce(item) && filterNote(item) && filterTitle(item);
    }

  }

  async ngOnInit() {
    this.geo.getPosition().then(coords => {
      this.position = { latitude: coords.coords.latitude, longitude: coords.coords.longitude };
      this.sorterFunction = (a: SupplierModel, b: SupplierModel) => {
        return this.geo.distance(a.address.latitude, a.address.longitude, this.position.latitude, this.position.longitude) -
          this.geo.distance(b.address.latitude, b.address.longitude, this.position.latitude, this.position.longitude);
      }
    });
  }



  ngOnChanges(changes: SimpleChanges) {
    this.geo.getPosition().then(coords => {
      this.position = { latitude: coords.coords.latitude, longitude: coords.coords.longitude };
    });

  }

}
