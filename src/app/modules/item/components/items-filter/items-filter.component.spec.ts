// tslint:disable:semicolon
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsFilterComponent } from './items-filter.component';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { QuestionBase } from 'src/app/modules/dynamic-form/models/question-base';
import { ItemModelInterface } from '../../models/itemModelInterface';
import { MockShoppingKartervice } from 'src/app/models/mockers/mockShoppingKartService';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';

describe('ItemsFilterComponent', () => {
  let component: ItemsFilterComponent;
  let fixture: ComponentFixture<ItemsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsFilterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ModalController, AngularDelegate],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const filterFunctionA = (item: string) => item.includes('testA')
    const filterFunctionB = (item: string) => item.includes('testB')
    const questionA = new QuestionBase<string>({
      order: 0,
      key: 'testA',
      label: 'test',
      value: 'text to be tested',
      filterFunction: filterFunctionA
    })
    const questionB = new QuestionBase<string>({
      order: 0,
      key: 'testB',
      label: 'test',
      value: 'text to be tested',
      filterFunction: filterFunctionA
    })
    const purchaseData = {
      barcode: '123456', key: '0', descrizione: 'questo è un test', picture: 'picture', prezzo: '125.5',
      categorieId: ['a', 'b', 'c']
    }

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
    const kartService = new MockShoppingKartervice(testdata)
    const kart = new ShoppingKartModel({ item: kartdata,// service: kartService 
    })
    kart.load()
    const kartsList = [kart]
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('filtering shoppingKart only by title', () => {
    const options = { Test: 'no filter' }
    const filterFunctionTitle = (value: string, item: ShoppingKartModel) => {
      return item.title.includes(value)
    }
    const questionTitle = new QuestionBase<string>({
      order: 0,
      key: 'title',
      label: 'title',
      value: 'titleFilter',
      filterFunction: filterFunctionTitle
    })
    const filterFunctionNote = (value: string, item: ShoppingKartModel) => item.note.includes(value)
    const questionNote = new QuestionBase<string>({
      order: 1,
      key: 'note',
      label: '',
      filterFunction: filterFunctionNote
    })
    const fields = [questionNote, questionTitle]
    const kartdata0 = {
      archived: false,
      dataAcquisto: '1977-03-16',
      fornitoreId: 'qwerty',
      pagamentoId: 'asdfghj',
      totale: 15,
      note: ' kart uno',
      title: 'primo kart',
      key: 'zxcvbnm'
    }
    const kart0 = new ShoppingKartModel().build(kartdata0)
    const kartdata1 = {
      archived: false,
      dataAcquisto: '1977-03-16',
      fornitoreId: 'qwerty',
      pagamentoId: 'asdfghj',
      totale: 15,
      title: 'secondo kart',
      note: ' secondo carrello',
      key: 'zxcvbnm'
    }
    const kart1 = new ShoppingKartModel().build(kartdata1)
    const kartsList = [kart0, kart1]
    const filterSettings = { title: 'kart' }
    const filterFunctionKartTitle = component.filterFactory(filterSettings, fields)
    expect(kartsList.filter(filterFunctionKartTitle).length).toBe(2)
    filterSettings.title = 'primo'
    const filterFunctionPrimoTitle = component.filterFactory(filterSettings, fields)
    expect(kartsList.filter(filterFunctionPrimoTitle).length).toBe(1)


  })
  it('filtering shoppingKart by title and note', () => {
    const filterFunctionTitle = (value: string, item: ShoppingKartModel) => item.title.includes(value)
    const questionTitle = new QuestionBase<string>({
      order: 0,
      key: 'title',
      label: 'title',
      value: 'titleFilter',
      filterFunction: filterFunctionTitle
    })
    const filterFunctionNote = (value: string, item: ShoppingKartModel) => item.note.includes(value)
    const questionNote = new QuestionBase<string>({
      order: 1,
      key: 'note',
      label: '',
      filterFunction: filterFunctionNote
    })
    const fields = [questionNote, questionTitle]
    const kartdata0 = {
      archived: false,
      dataAcquisto: '1977-03-16',
      fornitoreId: 'qwerty',
      pagamentoId: 'asdfghj',
      totale: 15,
      note: ' kart uno',
      title: 'primo kart',
      key: 'zxcvbnm0'
    }
    const kart0 = new ShoppingKartModel().build(kartdata0)
    const kartdata1 = {
      archived: false,
      dataAcquisto: '1977-03-16',
      fornitoreId: 'qwerty',
      pagamentoId: 'asdfghj',
      totale: 15,
      title: 'secondo kart',
      note: ' secondo carrello',
      key: 'zxcvbnm'
    }
    const kart1 = new ShoppingKartModel().build(kartdata1)
    const kartsList = [kart0, kart1]
    const filterSettings = { title: 'kart', note: 'secondo' }
    const filterFunctionKartTitleNote = component.filterFactory(filterSettings, fields)
    expect(kartsList.filter(filterFunctionKartTitleNote).length).toBe(1)
    expect(kartsList.filter(filterFunctionKartTitleNote)[0].title).toBe(kartdata1.title)
  })
});
