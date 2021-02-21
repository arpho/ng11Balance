import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateSupplierPage } from './create-supplier.page';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

describe('CreateSupplierPage', () => {
  let component: CreateSupplierPage;
  let fixture: ComponentFixture<CreateSupplierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSupplierPage ],
      providers:[ModalController,AngularDelegate],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[HttpClientModule,
        RouterTestingModule.withRoutes([]),]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSupplierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
