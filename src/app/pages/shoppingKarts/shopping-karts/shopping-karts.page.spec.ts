import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilitiesModule } from 'src/app/modules/utilities/utilities.module';

import { ShoppingKartsPage } from './shopping-karts.page';

describe('ShoppingKartsPage', () => {
  let component: ShoppingKartsPage;
  let fixture: ComponentFixture<ShoppingKartsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingKartsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers:[UtilitiesModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingKartsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
