import { DateModel } from "../modules/user/models/birthDateModel"
import { ExtendedShoppingKartModel } from "./extendedShoppingKart"
import { MockPaymentService } from "./mockers/mockPaymentService"
import { ShoppingKartModel } from "./shoppingKartModel"
import { ItemServiceInterface } from '../modules/item/models/ItemServiceInterface'
import { PaymentsModel } from "./paymentModel"
import { PurchaseModel } from "./purchasesModel"

describe('we instatiate an extended shoppingkart with reglar shoppingkart without items', () => {

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
    const paymentService = new MockPaymentService()
    const kart = new ShoppingKartModel()
    kart.build(kartdata)
    const xkart = new ExtendedShoppingKartModel({ data: kart, paymentsService: paymentService })
    it('shoppingKart data are ok', () => {
        expect(kart.dataAcquisto).toBe(kartdata.dataAcquisto)
        expect(xkart.fornitoreId).toBe(kartdata.fornitoreId)
        expect(xkart.pagamentoId).toBe(kartdata.pagamentoId)
        expect(xkart.archived).toBe(kartdata.archived)
        expect(xkart.key).toBe(kart.key)
        expect(xkart.note).toBe(kartdata.note)
        expect(xkart.purchaseDate.formatDate()).toBe(new DateModel(new Date(kartdata.dataAcquisto)).formatDate())
        expect(xkart.title).toBe(kartdata.title)
        expect(xkart.totale).toBe(kartdata.totale)
        expect(xkart.payments.length).toEqual(1)
        expect(xkart.payments[0].amount).toEqual(kartdata.totale)
        expect(xkart.payments[0].key).toEqual(kartdata.pagamentoId)
        expect(xkart.payments[0].paymentDate.formatDate()).toEqual(new DateModel(new Date(kartdata.dataAcquisto)).formatDate())
    })
})

describe('we instatiate an extended shoppingkart with regular shoppingkart with only one item', () => {

    const purchaseData = {
        barcode: '123456', key: '0', descrizione: 'questo è un test', picture: 'picture', prezzo: '100',
        categorieId: ['a', 'b', 'c']
    }
    const kartdata = {
        archived: false,
        dataAcquisto: '1977-03-16',
        fornitoreId: 'qwerty',
        pagamentoId: '123',
        totale: 100,
        title: 'title',
        note: 'note',
        key: 'zxcvbnm',
        items: [purchaseData]
    }
    const kart = new ShoppingKartModel()

    const paymentTestData = { key: '123', title: 'qwerty', note: 'asdfghj', addebito: '12/05/2019', nome: 'cash' }
    const payment = new PaymentsModel(paymentTestData)
    kart.build(kartdata)
    const mocker = new MockPaymentService()
    mocker.pushMockItem(payment)
    const xkart = new ExtendedShoppingKartModel({ data: kartdata, paymentsService: mocker })
    it('shoppingKart data are ok', () => {
        expect(kart.dataAcquisto).toBe(kartdata.dataAcquisto)
        expect(xkart.fornitoreId).toBe(kartdata.fornitoreId)
        expect(xkart.pagamentoId).toBe(kartdata.pagamentoId)
        expect(xkart.archived).toBe(kartdata.archived)
        expect(xkart.key).toBe(kart.key)
        expect(xkart.note).toBe(kartdata.note)
        expect(xkart.purchaseDate.formatDate()).toBe(new DateModel(new Date(kartdata.dataAcquisto)).formatDate())
        expect(xkart.title).toBe(kartdata.title)
        expect(xkart.totale).toBe(kartdata.totale)
        expect(xkart.payments[0].nome).toEqual(paymentTestData.nome)
        expect(xkart.howManyInstallments()).toEqual(1)
        expect(xkart.paymentsInPeriod(new DateModel(new Date('03/14/1977'))).length).toEqual(1)
    })
})



describe('we instatiate an extended shoppingkart with regular shoppingkart with only one item and two payments', () => {

    const purchaseData = {
        barcode: '123456', key: '0', descrizione: 'questo è un test', picture: 'picture', prezzo: '100',
        categorieId: ['a', 'b', 'c']
    }
    const kartdata = {
        archived: false,
        dataAcquisto: '1977-03-16',
        fornitoreId: 'qwerty',
        pagamentoId: '123',
        totale: 100,
        title: 'title',
        note: 'note',
        key: 'zxcvbnm',
        payments: [{ paymentKey: '123', amount: 80, paymentDate: new DateModel(new Date()).formatDate() }, { paymentKey: '124', amount: 20, paymentDate: new DateModel(new Date()).formatDate() }],
        items: [purchaseData]
    }
    const kart = new ShoppingKartModel()

    const paymentTestData = { key: '123', title: 'qwerty', note: 'asdfghj', addebito: '12/05/2019', nome: 'cash' }
    const paymentTestData2 = { key: '124', title: 'qwerty', note: 'asdfghj', addebito: '14/05/2019', nome: 'satispay' }
    const payment = new PaymentsModel(paymentTestData)
    const payment2 = new PaymentsModel(paymentTestData2)
    kart.build(kartdata)
    const mocker = new MockPaymentService()
    mocker.pushMockItem(payment)
    mocker.pushMockItem(payment2)
    const xkart = new ExtendedShoppingKartModel({ data: kartdata, paymentsService: mocker })
    it('shoppingKart data are ok', () => {
        expect(xkart.payments.length).toEqual(2)
        expect(kart.dataAcquisto).toBe(kartdata.dataAcquisto)
        expect(xkart.fornitoreId).toBe(kartdata.fornitoreId)
        expect(xkart.pagamentoId).toBe(kartdata.pagamentoId)
        expect(xkart.archived).toBe(kartdata.archived)
        expect(xkart.key).toBe(kart.key)
        expect(xkart.note).toBe(kartdata.note)
        expect(xkart.purchaseDate.formatDate()).toBe(new DateModel(new Date(kartdata.dataAcquisto)).formatDate())
        expect(xkart.title).toBe(kartdata.title)
        expect(xkart.totale).toBe(kartdata.totale)
        expect(xkart.payments[0].nome).toEqual(paymentTestData.nome)
        expect(xkart.payments[1].nome).toEqual(paymentTestData2.nome)
        expect(xkart.isFullyPayed()).toBeTrue()
        expect(xkart.howManyInstallments()).toEqual(1)
        expect(xkart.payedAmount()).toEqual(100)
    })
})

describe('we instatiate an extended shoppingkart with regular shoppingkart with only one item and two payments only partly payed', () => {

    const purchaseData = new PurchaseModel({
        barcode: '123456', key: '0', descrizione: 'questo è un test', picture: 'picture', prezzo: '100',
        categorieId: ['a', 'b', 'c']
    })
    const kartdata = {
        archived: false,
        dataAcquisto: '1977-03-16',
        fornitoreId: 'qwerty',
        pagamentoId: '123',
        totale: 100,
        title: 'title',
        note: 'note',
        key: 'zxcvbnm',
        payments: [{ paymentKey: '123', amount: 80, paymentDate: new DateModel(new Date('05/31/2019')).formatDate() },
        { paymentKey: '124', amount: 10, paymentDate: new DateModel(new Date('05/12/2019')).formatDate() }],
        items: [purchaseData]
    }
    const kart = new ShoppingKartModel()

    const paymentTestData = { key: '123', title: 'qwerty', note: 'asdfghj', addebito: '31/05/2019', nome: 'cash' }
    const paymentTestData2 = { key: '124', title: 'qwerty', note: 'asdfghj', addebito: '12/05/2019', nome: 'satispay' }
    const payment = new PaymentsModel(paymentTestData)
    const payment2 = new PaymentsModel(paymentTestData2)
    kart.build(kartdata)
    const mocker = new MockPaymentService()
    mocker.pushMockItem(payment)
    mocker.pushMockItem(payment2)
    const xkart = new ExtendedShoppingKartModel({ data: kartdata, paymentsService: mocker })
    it('shoppingKart data are ok', () => {
        expect(xkart.payments.length).toEqual(2)
        expect(xkart.totale).toBe(kartdata.totale)
        expect(xkart.payments[0].nome).toEqual(paymentTestData.nome)
        expect(xkart.payments[1].nome).toEqual(paymentTestData2.nome)
        expect(xkart.isFullyPayed()).toBeFalse()
        expect(xkart.payedAmount()).toEqual(90)
        expect(xkart.serialize().payments.length).toEqual(2)
        expect(xkart.ispayedWith('123')).toBeTrue()
        expect(xkart.ispayedWith('124')).toBeTrue()
        expect(xkart.ispayedWith('125')).toBeFalse()
        expect(xkart.payedUntil(new Date('05/13/2019'))).toEqual(10)
        expect(xkart.howManyInstallments()).toEqual(2)
    })
    it('filter extended kart by date payment', () => {
        const purchaseData = new PurchaseModel({
            barcode: '123456', key: '0', descrizione: 'questo è un test', picture: 'picture', prezzo: '100',
            categorieId: ['a', 'b', 'c']
        })
        const kartdata = {
            archived: false,
            dataAcquisto: '1977-03-16',
            fornitoreId: 'qwerty',
            pagamentoId: '123',
            totale: 100,
            title: 'title',
            note: 'note',
            key: 'zxcvbnm',
            payments: [{ paymentKey: '123', amount: 80, paymentDate: new DateModel(new Date('05/31/2019')).formatDate() },
            { paymentKey: '124', amount: 10, paymentDate: new DateModel(new Date('05/12/2019')).formatDate() }],
            items: [purchaseData]
        }
        const log = console.log.bind(document)
        const kart = new ShoppingKartModel()

        const paymentTestData = { key: '123', title: 'qwerty', note: 'asdfghj', addebito: '31/05/2019', nome: 'cash' }
        const paymentTestData2 = { key: '124', title: 'qwerty', note: 'asdfghj', addebito: '12/05/2019', nome: 'satispay' }
        const payment = new PaymentsModel(paymentTestData)
        const payment2 = new PaymentsModel(paymentTestData2)
        kart.build(kartdata)
        const mocker = new MockPaymentService()
        mocker.pushMockItem(payment)
        mocker.pushMockItem(payment2)
        const xkart = new ExtendedShoppingKartModel({ data: kartdata, paymentsService: mocker })
        expect(xkart.paymentsInPeriod(new DateModel(new Date('05/30/2019'))).length).toEqual(1)
        expect(xkart.paymentsInPeriod(new DateModel(new Date('05/30/2019')))[0].key).toEqual('123')
        expect(xkart.paymentsInPeriod(undefined, new DateModel(new Date('05/13/2019')))[0].key).toEqual('124')
        expect(xkart.paymentsInPeriod(new DateModel(new Date('05/10/2019')), new DateModel(new Date('05/13/2019')))[0].key).toEqual('124')
        expect(xkart.paymentsInPeriod(new DateModel(new Date('05/10/2019')), new DateModel(new Date('05/13/2019'))).length).toEqual(1)
        expect(xkart.howManyInstallments()).toEqual(2)
    })
})