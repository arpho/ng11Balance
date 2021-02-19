import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [AlertController],
      imports: [RouterModule, RouterTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
