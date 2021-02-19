import { TestBed } from '@angular/core/testing';

import { CategoriesService } from './categorie.service';
import { ShoppingKartsService } from '../shoppingKarts/shopping-karts.service';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';
import { PurchaseModel } from 'src/app/models/purchasesModel';
import { CategoryModel } from 'src/app/models/CategoryModel';

describe('CategorieService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoriesService = TestBed.get(CategoriesService);
    expect(service).toBeTruthy();
  });


  it('should trasform karts list ', () => {
    const service: CategoriesService = TestBed.get(CategoriesService);
    const kartdata = {
      archived: false,
      dataAcquisto: '1977-03-16',
      fornitoreId: 'qwerty',
      pagamentoId: 'asdfghj',
      totale: 15,
      title: 'title',
      note: 'note',
      key: 'zxcvbnm'
    }
    const kart = new ShoppingKartModel()
    kart.build(kartdata)
    const a = new PurchaseModel({ key: 'a', prezzo: 1, categorieId: ['a', 'b', 'c'], descrizione: 'a' }).initialize({ key: 'a', prezzo: 1, categorieId: ['a', 'b', 'c'], descrizione: 'a' })
    const b = new PurchaseModel({ key: 'b', prezzo: 2, categorieId: ['a', 'b', 'c'], descrizione: 'b' }).initialize({ key: 'b', prezzo: 2, categorieId: ['a', 'b', 'c'], descrizione: 'b' })
    const inizializeCategory = (cat: CategoryModel, categoriesServiceMocker: any) => cat.initialize(categoriesServiceMocker.filter((Cat) => Cat.key == cat.key)[0])
    const catService = [{ key: 'a', title: 'A' }, { key: 'b', title: 'B' }, { key: 'c', title: 'C' }]
    const initializeCategoryWrapper = (cat: CategoryModel) => inizializeCategory(cat, catService)
    a.categorie = a.categorieId.map(key => new CategoryModel(key)).map(initializeCategoryWrapper)
    b.categorie = b.categorieId.map(key => new CategoryModel(key)).map(initializeCategoryWrapper)
    kart.addItem(b)
    kart.addItem(a)
    if (service) {
      console.log('cataservice', service)
      expect([kart].reduce(service.ItemskartMapper2, []).map(service.itemsMapper2).length).toBe(2)
      expect([kart].reduce(service.ItemskartMapper2, []).map(service.itemsMapper2)[0].price).toBe(2)
      expect([kart].reduce(service.ItemskartMapper2, []).map(service.itemsMapper2)[1].price).toBe(1)
      expect([kart].reduce(service.ItemskartMapper2, []).map(service.itemsMapper2)[1].categorie.length).toBe(3)
      expect([kart].reduce(service.ItemskartMapper2, []).map(service.itemsMapper2).map(service.blowupCategories).length).toBe(2)
      expect([kart].reduce(service.ItemskartMapper2, []).map(service.itemsMapper2).map(service.blowupCategories)[0].length).toBe(3)
      console.log('cataservice 2', service)
      expect(service.blowCategoriesUp([kart]).length).toBe(6)
    }
    expect(service.counterWidget('a', [kart])).toBe(2)
    expect(service.adderWidget('a', [kart])).toBe(3)
  })

});
