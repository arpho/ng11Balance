import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentPage } from './create-payment.page';
import { ModalController, AngularDelegate } from '@ionic/angular';

describe('CreatePaymentPage', () => {
  let component: CreatePaymentPage;
  let fixture: ComponentFixture<CreatePaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePaymentPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ModalController, AngularDelegate]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
