import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSupplierPage } from './view-supplier.page';
import { ModalController, AngularDelegate, NavParams } from '@ionic/angular';
import { MockNavParams } from 'src/app/modules/item/pages/filter-popup/mockNavParams';

describe('ViewSupplierPage', () => {
  let component: ViewSupplierPage;
  let fixture: ComponentFixture<ViewSupplierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSupplierPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ModalController, AngularDelegate, { provide: NavParams, useClass: MockNavParams }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSupplierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
