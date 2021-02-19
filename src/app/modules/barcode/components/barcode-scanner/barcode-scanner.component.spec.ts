import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarcodeScannerComponent } from './barcode-scanner.component';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { ReactiveFormsModule } from '@angular/forms';

describe('BarcodeScannerComponent', () => {
  let component: BarcodeScannerComponent;
  let fixture: ComponentFixture<BarcodeScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BarcodeScannerComponent],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [NativeAudio]
    }).compileComponents();

    fixture = TestBed.createComponent(BarcodeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
