import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FidelityCardModel } from './fidelityCardModel';

describe('testing fidelityCardModel',()=>{
    const testData = {title:'test',note:'this is a test',barcode:'qwertyu',key:'1234556',archived:true}
    const card = new FidelityCardModel(testData)
    it('card should be loaded correctly',()=>{
        expect(card.key).toBe(testData.key)
        expect(card.title).toBe(testData.title)
        expect(card.barcode).toBe(testData.barcode)
        expect(card.note).toBe(testData.note)
    })
    it('card should serisalize correctly',()=>{
        const serialized = card.serialize()
        expect(serialized.key).toBe(testData.key)
        expect(serialized.title).toBe(testData.title)
        expect(serialized.barcode).toBe(testData.barcode)
        expect(serialized.note).toBe(testData.note)
    })
})