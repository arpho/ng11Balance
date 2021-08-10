import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailShoppingKartPage } from './detail-shopping-kart.page';
import { ModalController, AngularDelegate, NavParams } from '@ionic/angular';
import { MockNavParams } from './mockNavParams';
import { HttpClientModule } from '@angular/common/http';
import { UtilitiesModule } from 'src/app/modules/utilities/utilities.module';

describe('DetailShoppingKartPage', () => {
  let component: DetailShoppingKartPage;
  let fixture: ComponentFixture<DetailShoppingKartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailShoppingKartPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        ModalController,
        AngularDelegate,
        { provide: NavParams, useClass: MockNavParams },
        UtilitiesModule
      ],
      imports: [HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailShoppingKartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
