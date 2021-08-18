import { TestBed } from '@angular/core/testing';
import { RawItem } from './rawItem'
describe("instatiating rawItem", () => {
    const item1 = new RawItem({ item: { msg: 'test', key: 'qwerty' }, key: 'qwerty1' })
    it('field should be correctly assigned', () => {
        expect(item1.item['msg']).toEqual('test')
        expect(item1.item['key']).toEqual('qwerty')
        expect(item1.key).toEqual('qwerty1')
    })
})