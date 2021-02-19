import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputGeolocationComponent } from './input-geolocation.component';
import { IonicModule, NavController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Location, LocationStrategy, PathLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

describe('InputGeolocationComponent', () => {
  let component: InputGeolocationComponent;
  let fixture: ComponentFixture<InputGeolocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputGeolocationComponent],
      imports: [IonicModule.forRoot(), HttpClientModule,ReactiveFormsModule],
      providers: [NavController, Location, { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/my/app' }]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputGeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
