import { DateModel } from "../modules/user/models/birthDateModel"
import { ExtendedShoppingKartModel } from "./extendedShoppingKart"
import { ShoppingKartModel } from "./shoppingKartModel"

describe('we instatiate an extended shoppingkart with reglar shoppingkart without items',()=>{

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
    const xkart = new ExtendedShoppingKartModel(kart)
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
    })
})