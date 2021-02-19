import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScannerPopupPage } from './scanner-popup.page';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

describe('ScannerPopupPage', () => {
  let component: ScannerPopupPage;
  let fixture: ComponentFixture<ScannerPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannerPopupPage ],
      providers:[NativeAudio],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
