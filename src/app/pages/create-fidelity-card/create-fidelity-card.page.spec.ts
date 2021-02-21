import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateFidelityCardPage } from './create-fidelity-card.page';
import { DynamicFormModule } from 'src/app/modules/dynamic-form/dynamic-form.module';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

describe('CreateFidelityCardPage', () => {
  let component: CreateFidelityCardPage;
  let fixture: ComponentFixture<CreateFidelityCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFidelityCardPage ],
      providers:[NativeAudio],
      imports: [
        IonicModule.forRoot(),
        DynamicFormModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFidelityCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
