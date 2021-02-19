import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController, AngularDelegate, NavParams } from '@ionic/angular';

import { EditWidgetPage } from './edit-widget.page';
import { DynamicFormModule } from 'src/app/modules/dynamic-form/dynamic-form.module';
import { MockNavParams } from './mockNavParams';

describe('EditWidgetPage', () => {
  let component: EditWidgetPage;
  let fixture: ComponentFixture<EditWidgetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWidgetPage ],
      imports: [IonicModule.forRoot(),DynamicFormModule],
      providers: [
        ModalController,
        AngularDelegate,
        { provide: NavParams, useClass: MockNavParams },
      ], 
    }).compileComponents();

    fixture = TestBed.createComponent(EditWidgetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
