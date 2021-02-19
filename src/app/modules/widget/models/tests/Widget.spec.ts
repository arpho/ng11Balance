import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Widget } from '../Widget';
import { stringify } from 'querystring';
import { WidgetServiceMocker } from './mockWidgetService';
import { WidgetOperation, WidgetTypes } from '../WidgetsTypes';
describe("testing Widget", () => {
    let widget;
    beforeEach(() => {
        widget = new Widget({ service: new WidgetServiceMocker(), serviceKey:'serviceKey', entityKey: 'testKey', temporalWindow: 1, counter: true, _order: 0, _key: 12, note: 'nota', title: 'test', description: 'descrizione' })

    })
    it('widget should instantiate', () => {
        expect(widget).toBeTruthy()
        expect(widget.key).toBe(12)
    })
    it('widget should serialize correctly', () => {
        const serialized = widget.serialize()
        expect(serialized._order).toBe(0)
        expect(serialized.serviceKey).toBe('serviceKey')
        expect(serialized.key).toBe(12)
        expect(serialized.entityKey).toBe('testKey')
        expect(serialized.temporalWindow).toBe(1)
        expect(serialized.counter).toBeTruthy()
        expect(serialized.widget).toBe(WidgetTypes.Regular)
    })
    it('widget should load', () => {
        widget = new Widget().load({ service: new WidgetServiceMocker(), entityKey: 'testKey2', temporalWindow: 2, _order: 2, _key: 12, note: 'nota', title: 'test', description: 'descrizione',serviceKey:'mock' })
        const serialized = widget.serialize()
        expect(serialized._order).toBe(2)
        expect(widget.serialize().key).toBeTruthy()
        expect(serialized.entityKey).toBe('testKey2')
        expect(serialized.title).toBe('test')
        expect(serialized.description).toBe('descrizione')
        expect(serialized.serviceKey).toBe('mock')
        expect(serialized.temporalWindow).toBe(2)
        expect(serialized.counter).toBeFalsy()
    })
    it('order should be setted and getted', () => {
        expect(widget.order).toBe(0)
        widget.order = 3
        expect(widget.order).toBe(3)
    })
})