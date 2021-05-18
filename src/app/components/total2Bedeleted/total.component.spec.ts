import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalComponent } from './total.component';
import { PurchaseModel } from 'src/app/models/purchasesModel';

describe('TotalComponent', () => {
  let component: TotalComponent;
  let fixture: ComponentFixture<TotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TotalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should calculate the total', () => {
    component.total.subscribe(value => {
      expect(value).toBe(4)
    })
    component.items = [
      new PurchaseModel({ prezzo: 0 }),
      new PurchaseModel({ prezzo: 1 }),
      new PurchaseModel({ prezzo: 3 })
    ]
  })
});
