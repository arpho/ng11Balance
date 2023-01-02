import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavParams } from '@ionic/angular';

import { EditPaymentPage } from './edit-payment.page';

describe('EditPaymentPage', () => {
  let component: EditPaymentPage;
  let fixture: ComponentFixture<EditPaymentPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPaymentPage ],
      imports: [IonicModule.forRoot()],
      providers:[NavParams]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
