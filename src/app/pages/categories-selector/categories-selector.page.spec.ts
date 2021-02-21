import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSelectorPage } from './categories-selector.page';
import { FilterItemsPipe } from 'src/app/modules/item/pipes/filter-items.pipe';
import { SorterItemsPipe } from 'src/app/modules/item/pipes/sorter-items.pipe';
import { ModalController, AngularDelegate, NavParams } from '@ionic/angular';
import { MockNavParams } from './mockNavParams';

describe('CategoriesSelectorPage', () => {
  let component: CategoriesSelectorPage;
  let fixture: ComponentFixture<CategoriesSelectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesSelectorPage, FilterItemsPipe, SorterItemsPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ModalController, AngularDelegate,
        { provide: NavParams, useClass: MockNavParams }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
