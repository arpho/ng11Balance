import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPaymentPage } from './detail-payment.page';
import { ModalController, AngularDelegate, NavParams } from '@ionic/angular';
import { MockNavParams } from './mockNavParams';

describe('DetailPaymentPage', () => {
  let component: DetailPaymentPage;
  let fixture: ComponentFixture<DetailPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailPaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers:[ModalController,AngularDelegate, { provide: NavParams, useClass: MockNavParams }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
