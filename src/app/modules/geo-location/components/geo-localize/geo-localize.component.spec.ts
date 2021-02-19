import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, } from '@ionic/angular';
import { GeoLocalizeComponent } from './geo-localize.component';
import { AgmCoreModule } from '@agm/core';
import { Location, LocationStrategy, PathLocationStrategy, APP_BASE_HREF } from '@angular/common';

describe('GeoLocalizeComponent', () => {
  let component: GeoLocalizeComponent;
  let fixture: ComponentFixture<GeoLocalizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeoLocalizeComponent],
      imports: [IonicModule.forRoot(), AgmCoreModule],
      providers: [NavController, Location, { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/my/app' }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoLocalizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
