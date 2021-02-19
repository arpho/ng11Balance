import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFormComponent } from './question-form-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GeoLocationModule } from 'src/app/modules/geo-location/geo-location.module';
import { CommonModule } from '@angular/common';
import { ItemModule } from 'src/app/modules/item/item.module';
import { BarcodeModule } from 'src/app/modules/barcode/barcode.module';

describe('QuestionFormComponent', () => {
  let component: QuestionFormComponent;
  let fixture: ComponentFixture<QuestionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionFormComponent],
      imports: [ReactiveFormsModule,
        CommonModule,
        IonicModule.forRoot(),
        GeoLocationModule,
        ItemModule,
        BarcodeModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
