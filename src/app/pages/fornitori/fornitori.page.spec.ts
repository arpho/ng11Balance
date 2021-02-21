import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FornitoriPage } from './fornitori.page';
import { GeoLocationModule } from 'src/app/modules/geo-location/geo-location.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('FornitoriPage', () => {
  let component: FornitoriPage;
  let fixture: ComponentFixture<FornitoriPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FornitoriPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[GeoLocationModule,
        RouterTestingModule.withRoutes([]),]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FornitoriPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
