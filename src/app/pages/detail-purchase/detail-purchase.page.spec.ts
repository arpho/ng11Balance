import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPurchasePage } from './detail-purchase.page';
import { ModalController, AngularDelegate, NavParams } from '@ionic/angular';
import { MockNavParams } from '../view-supplier/mockNavParams';

describe('DetailPurchasePage', () => {
  let component: DetailPurchasePage;
  let fixture: ComponentFixture<DetailPurchasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailPurchasePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ModalController, AngularDelegate,
        { provide: NavParams, useClass: MockNavParams }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPurchasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
