
// tslint:disable: semicolon
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseModel } from './purchasesModel';
import { CategoryModel } from './CategoryModel';
import { MockCategoriesService } from './mockers/mockCategoriesService';
describe('testing purchaseModel', () => {
    const testdata = {
        barcode: '123456', key: '0', descrizione: 'poiuytr', picture: 'picture', prezzo: '125.5',
        categorieId: ['a', 'b', 'c']
    }
    let purchase = new PurchaseModel(testdata)
    it('purchase insttiated', () => {
        expect(purchase).toBeTruthy()
    })
    it('barcode field is ok', () => {
        expect(purchase.barcode).toBe(testdata.barcode)
    })
    it('descrizione field is ok', () => {
        expect(purchase.descrizione).toBe(testdata.descrizione)
    })

    it('key is ok', () => {
        expect(purchase.key).toBe(testdata.key)
    })
    it('picture field is ok', () => {
        expect(purchase.picture).toBe(testdata.picture)
    })
    it('prezzo should a float', () => {
        const testdata = {
            barcode: '123456', key: '0', descrizione: 'poiuytr', picture: 'picture', prezzo: '125.5',
            categorieId: ['a', 'b', 'c']
        }
        let purchase = new PurchaseModel(testdata)
        expect(purchase.prezzo).toBe(125.5)
    })

    it('categorie should be ok', () => {
        const Purchase = new PurchaseModel(testdata)
        expect(Purchase.categorie).toBeTruthy()
        expect(Purchase.categorie.length).toBe(3)
        expect(Purchase.categorie[0].getKey()).toBe('a')
        expect(Purchase.categorie[1].getKey()).toBe('b')
        expect(Purchase.categorie[2].getKey()).toBe('c')
    })
    it('clone should work', () => {
        const clonedata = {
            barcode: '123456', prezzo: '123456.5', note: 'ìqwertyu', moneta: '$', descrizione: 'poiuytr',
            picture: 'picture', categorie:
                [new CategoryModel().build({ title: 'a', key: 'a' }), new CategoryModel().build({ title: 'b', key: 'b' }),
                new CategoryModel().build({ title: 'c', key: 'c' })]
        }
        purchase.clone(clonedata)
        expect(purchase.key).toBe(testdata.key)
        expect(purchase.barcode).toBe(clonedata.barcode)
        expect(purchase.descrizione).toBe(clonedata.descrizione)
        expect(purchase.note).toBe(clonedata.note)
        expect(purchase.moneta).toBe(clonedata.moneta)
        expect(purchase.picture).toBe(clonedata.picture)
        expect(purchase.prezzo).toBe(123456.5)
        expect(purchase.categorie).toBeTruthy()
        expect(purchase.categorie.length).toBe(3)
        expect(purchase.serialize().barcode).toBe(clonedata.barcode)
        expect(purchase.serialize().descrizione).toBe(clonedata.descrizione)
        expect(purchase.serialize().categorieId.length).toBe(3)
    })
    it('serialize should work', () => {
        purchase = new PurchaseModel(testdata)
        //  expect(purchase.serialize().categorie.length).toBe(3)
        // expect(purchase.serialize().categorie[0]).toBe(testdata.categorie[0].serialize())
        expect(purchase.serialize().barcode).toBe(testdata.barcode)
        const testdata2 = {}
        const purchase2 = new PurchaseModel(testdata2)
        expect(purchase2.serialize().descrizione).toBe('')
        expect(purchase2.serialize().key).toBeTruthy()
        expect(purchase2.serialize().picture).toBe('')
        expect(purchase2.serialize().categorieId.length).toBe(0)
    })


})
describe('testing loading', () => {

    const inizializeCategory = (cat: CategoryModel, categoriesServiceMocker: any) => cat.initialize(categoriesServiceMocker.filter((Cat) => Cat.key == cat.key)[0])

    const service = new MockCategoriesService()
    const testdata = {
        barcode: '123456', key: '0', descrizione: 'questo è un test', picture: 'picture', prezzo: '125.5',
        categorieId: ['a', 'b', 'c']
    }
    it('purchase to be loaded', () => {
        const purchase = new PurchaseModel(testdata, //service
        )
        expect(purchase).toBeTruthy()
        const catService = [{ key: 'a', title: 'A' }, { key: 'b', title: 'B' }, { key: 'c', title: 'C' }]
        const initializeCategoryWrapper = (cat: CategoryModel) => inizializeCategory(cat, catService)
        purchase.categorie = purchase.categorie.map(initializeCategoryWrapper)
        expect(purchase.categorie.length).toBe(testdata.categorieId.length)
        expect(purchase.categorie[0]).toEqual(jasmine.any(CategoryModel))
        expect(purchase.getCategoriesKeys().length).toBe(3)
        expect(purchase.getCategoriesKeys().includes('a')).toBeTruthy
        expect(purchase.getCategoriesKeys().includes('b')).toBeTruthy
        expect(purchase.getCategoriesKeys().includes('c')).toBeTruthy
        expect(purchase.categorie[0].title).toBe('A')

    })

})
