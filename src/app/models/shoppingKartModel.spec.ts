// tslint:disable: semicolon
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingKartModel } from './shoppingKartModel'
import { DateModel } from '../modules/user/models/birthDateModel';
import { PurchaseModel } from './purchasesModel';
import { SupplierModel } from './supplierModel';
import { MockCategoriesService } from './mockers/mockCategoriesService';
import { MockShoppingKartervice } from './mockers/mockShoppingKartService';
import { SuppliersService } from '../services/suppliers/suppliers.service';
import { PaymentsService } from '../services/payments/payments.service';
import { MockSupplierService } from './mockers/mockSuppliersService';
import { MockPaymentService } from './mockers/mockPaymentService';
import { CategoryModel } from './CategoryModel';
describe('ShoppingKart should instantiate', () => {
    const kartdata = {
        archived: false,
        dataAcquisto: '1977-03-16',
        fornitoreId: 'qwerty',
        pagamentoId: 'asdfghj',
        totale: 0,
        title: 'title',
        note: 'note',
        key: 'zxcvbnm'
    }
    const kart = new ShoppingKartModel()
    kart.build(kartdata)
    it('shoppingKart data are ok', () => {
        expect(kart.dataAcquisto).toBe(kartdata.dataAcquisto)
        expect(kart.fornitoreId).toBe(kartdata.fornitoreId)
        expect(kart.pagamentoId).toBe(kartdata.pagamentoId)
        expect(kart.archived).toBe(kartdata.archived)
        expect(kart.key).toBe(kart.key)
        expect(kart.note).toBe(kartdata.note)
        expect(kart.purchaseDate.formatDate()).toBe(new DateModel(new Date(kartdata.dataAcquisto)).formatDate())
        expect(kart.title).toBe(kartdata.title)
        expect(kart.totale).toBe(kartdata.totale)
    })
})
describe('serialize must not have undefined fields', () => {
    const kartdata = {
    }
    const kart = new ShoppingKartModel()
    kart.build(kartdata)
    it('checking pagamentoId', () => {
        expect(kart.serialize().pagamentoId).toBe('')
    })
    it('checking title', () => {
        expect(kart.serialize().title).toBe('')
    })

    it('check fornitoreId', () => {
        expect(kart.serialize().fornitoreId).toBe('')
    })

    it('check pagamentoId', () => {
        expect(kart.serialize().pagamentoId).toBe('')
    })



    it('checking fornitoreId', () => {
        expect(kart.serialize().fornitoreId).toBe('')
    })

    it('checking key', () => {
        expect(kart.serialize().key).toBe('')
    })

    it('checking archived', () => {
        expect(kart.serialize().archived).toBe(false)
    })

    it('checking online', () => {
        expect(kart.serialize().online).toBe(false)
    })

    it('checking dataAcquisto', () => {
        expect(kart.serialize().dataAcquisto).toBeTruthy()
    })

    it('adding items should work', () => {
        const a = new PurchaseModel({ key: 'a', prezzo: 1, categorieId: ['a', 'b', 'c'], descrizione: 'a' })
        kart.addItem(a)
        expect(kart.items.length).toBe(1)
        expect(kart.items[0].prezzo).toBe(1)
        const b = new PurchaseModel({ key: 'b', prezzo: 2, categorieId: ['a', 'b', 'c'], descrizione: 'b' })
        kart.addItem(b)
        expect(kart.items.length).toBe(2)
        expect(kart.hasPurchaseDescription('a')).toBeTruthy
        expect(kart.hasPurchaseDescription('c')).toBeFalsy
        expect(kart.getCategoriesKeys().length).toBe(6)
        expect(kart.hasCategoryKey('a')).toBeTruthy
        expect(kart.hasCategoryKey('f')).toBeFalsy
        expect(kart.items[1].prezzo).toBe(2)

    })

    it('updating item shoulds work', () => {

        const kart = new ShoppingKartModel()
        const a = new PurchaseModel({ key: 'a', prezzo: 1, categorieId: ['a', 'b', 'c'], descrizione: 'a' })
        kart.addItem(a)
        expect(kart.items[0].prezzo).toBe(1)
        kart.updateItem(new PurchaseModel({ key: 'a', prezzo: 2 }))
        expect(kart.items[0].prezzo).toBe(2)
    })

    it('removing item ', () => {

        const kart = new ShoppingKartModel()
        const a = new PurchaseModel({ key: 'a', prezzo: 1, categorieId: ['a', 'b', 'c'], descrizione: 'a' })
        kart.addItem(a)
        expect(kart.items.length).toBe(1)
        expect(kart.items[0].prezzo).toBe(1)
        const b = new PurchaseModel({ key: 'b', prezzo: 2, categorieId: ['a', 'b', 'c'], descrizione: 'b' })
        kart.addItem(b)
        kart.removeItem(new PurchaseModel({ key: 'a' }))
        expect(kart.items.length).toBe(1)
        expect(kart.items[0].key).toBe('b')
    })
})

describe('getTitle should work when no fornitore', () => {
    const kartdata = {
        archived: false,
        dataAcquisto: '1977-03-16',
        fornitoreId: 'qwerty',
        pagamentoId: 'asdfghj',
        totale: 15,
        title: 'title',
        key: 'zxcvbnm',
        // fornitore: new SupplierModel({ title: 'test title', note: 'just 4 test', nome: 'dummy', key: 'test',
        ecommerce: false
        // })
    }
    const kart = new ShoppingKartModel({ item: kartdata }).initialize(kartdata)
    it('check getTitle returns the correct title when title is defined', () => {
        expect(kart.getTitle().value).toBe(kartdata.title)
    })

    it('check getTitle when title is not defined', () => {
        const testdata = {
            archived: false,
            dataAcquisto: '1977-03-16',
            fornitoreId: 'qwerty',
            pagamentoId: 'asdfghj',
            totale: 15,
            key: 'zxcvbnm',
            ecommerce: false
        }
        const KartNoTitle = new ShoppingKartModel(testdata)
        KartNoTitle.fornitore = new SupplierModel({
            title: 'supplier title', note: 'just 4 test', nome: 'dummy', key: 'test',
            ecommerce: false
        })
        expect(KartNoTitle.getTitle().value).toBe('supplier title')

    })

})

describe('loading purchase', () => {
    const purchaseData = {
        barcode: '123456', key: '0', descrizione: 'questo è un test', picture: 'picture', prezzo: '125.5',
        categorieId: ['a', 'b', 'c']
    }
    const testdata = {
        archived: false,
        dataAcquisto: '1977-03-16',
        fornitoreId: 'qwerty',
        pagamentoId: 'asdfghj',
        totale: 15,
        key: 'zxcvbnm',
        ecommerce: false,
        items: [purchaseData]
    }
    const categoriesService = new MockCategoriesService()
    const TestSupplierService = new MockSupplierService()
    const TestPaymentService = new MockPaymentService()
    const kartService = new MockShoppingKartervice(testdata)

    const kartdata = {
        archived: false,
        dataAcquisto: '1977-03-16',
        fornitoreId: 'qwerty',
        pagamentoId: 'asdfghj',
        totale: 15,
        title: 'title',
        key: 'zxcvbnm',
        items: [purchaseData]
    }
    const inizializeCategory = (cat: CategoryModel, categoriesServiceMocker: any) => cat.initialize(categoriesServiceMocker.filter((Cat) => Cat.key == cat.key)[0])
    const catService = [{ key: 'a', title: 'A' }, { key: 'b', title: 'B' }, { key: 'c', title: 'C' }]
    const initializeCategoryWrapper = (cat: CategoryModel) => inizializeCategory(cat, catService)
    it('kart should be created and purchase and categories instantiated', () => {
        const kartService1 = new MockShoppingKartervice(testdata)
        const kart1 = new ShoppingKartModel({
            item: kartdata,// service: kartService1 
        }
        )
        const purchase = new PurchaseModel().initialize(purchaseData)
        purchase.categorie = purchaseData.categorieId.map(key => new CategoryModel(key)).map(initializeCategoryWrapper)
        kart1.items = [purchase]
        expect(kart1).toEqual(jasmine.any(ShoppingKartModel))
        expect(kart1.items[0]).toEqual(jasmine.any(PurchaseModel))
        expect(kart1.items[0].categorie[0]).toEqual(jasmine.any(CategoryModel))
    })
    it('should load purchase and categories', () => {
        const kart = new ShoppingKartModel({
            item: kartdata,// service: kartService
        }
        )
        const purchase = new PurchaseModel().initialize(purchaseData)

        purchase.categorie = purchaseData.categorieId.map(key => new CategoryModel(key)).map(initializeCategoryWrapper)
        kart.items = [purchase]
        expect(kart.items.length).toBe(1)
        expect(kart.items[0]).toEqual(jasmine.any(PurchaseModel))
        expect(kart.items[0].categorie.length).toBe(3)
        expect(kart.items[0].categorie[0]).toEqual(jasmine.any(CategoryModel))
        expect(kart.items[0].categorie[0].title).toBe('A')
        expect(kart.items[0].categorie[1].title).toBe('B')
    })
})
