// tslint:disable: semicolon
// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierModel } from './supplierModel'
describe('testing supplierModel', () => {
    const pennyData = {
        /* "address" : {
           "address" : "Via degli Imbriani, 63, 20158 Milano MI, Italia",
           "latitude" : 45.5018955,
           "longitude" : 9.1661847
         },*/
        altitude: '',
        ecommerce: false,
        // tslint:disable: quotemark
        fidelity_card: "",
        indirizzo: "Via degli Imbriani, 63, 20158 Milano MI, Italia",
        key: "-Ks7cQ3uf6Dpwq3RlsJz",
        latitude: 45.5018955,
        latitudine: 45.5018955,
        longitude: 9.1661847,
        longitudine: 9.1661847,
        nome: "Penny Market bovisa",
        cliente: true,
        personaFisica: true,
        note: "",
        onLine: false,
    }
    const pennyData2 = {
        address: {
            address: "Via degli Imbriani, 63, 20158 Milano MI, Italia",
            latitude: 45.5018955,
            longitude: 9.1661847
        },
        altitude: "",
        ecommerce: false,
        fidelity_card: "",
        key: "-Ks7cQ3uf6Dpwq3RlsJz",
        nome: "",
        note: "",
        onLine: true,
    }
    const supplier = new SupplierModel(pennyData).setKey(pennyData.key)
    const supplier2 = new SupplierModel(pennyData2)
    it("supplier should be correct", () => {
        expect(supplier.cliente).toBe(pennyData.cliente)
        expect(supplier.personaFisica).toBe(pennyData.personaFisica)
        expect(supplier.key).toBe(pennyData.key)
        expect(supplier.title).toBe(pennyData.nome)
        expect(supplier.address.address).toBe(pennyData.indirizzo)
        expect(supplier.address.longitude).toBe(pennyData.longitude)
        expect(supplier.address.latitude).toBe(pennyData.latitude)
        expect(supplier2.address.address).toBe(pennyData2.address.address)
        expect(supplier2.address.latitude).toBe(pennyData2.address.latitude)
        expect(supplier2.address.longitude).toBe(pennyData2.address.longitude)
        expect(supplier.key).toBe(pennyData.key)
        expect(supplier.fidelity_card).toBe(pennyData.fidelity_card)
    })
    it("supplier should be serialized correctly", () => {
        expect(supplier.serialize()).toBeTruthy()
        // tslint:disable-next-line: no-string-literal
        expect(supplier.serialize()['nome']).toBeFalsy()
        expect(supplier.serialize().title).toBe(pennyData.nome)
        expect(supplier.serialize().address.address).toBe(pennyData.indirizzo)
        expect(supplier.serialize().address.latitude).toBe(pennyData.latitude)
        expect(supplier.serialize().address.longitude).toBe(pennyData.longitude)
        expect(supplier.serialize().note).toBe(pennyData.note)
        expect(supplier.serialize().ecommerce).toBe(pennyData.ecommerce)
        expect(supplier.serialize().fidelity_card).toBe(pennyData.fidelity_card)
        expect(supplier.serialize().title).toBe(pennyData.nome)
        expect(supplier.serialize().cliente).toBe(pennyData.cliente)
        expect(supplier.serialize().personaFisica).toBe(pennyData.personaFisica)
        expect(supplier.serialize()['altitude']).toBeFalsy()
        expect(supplier.serialize().fidelity_card).toBe(pennyData.fidelity_card)
        expect(supplier2.serialize().fidelity_card).toBe('')
        expect(supplier2.serialize().title).toBe('')
        expect(supplier2.serialize().personaFisica).toBe(false)
        expect(supplier2.serialize().cliente).toBe(false)
    })

})
