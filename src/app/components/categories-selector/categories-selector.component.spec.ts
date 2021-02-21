import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSelectorComponent } from './categories-selector.component';
import { ModalController, AngularDelegate } from '@ionic/angular';

describe('CategoriesSelectorComponent', () => {
  let component: CategoriesSelectorComponent;
  let fixture: ComponentFixture<CategoriesSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesSelectorComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ModalController, AngularDelegate]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
