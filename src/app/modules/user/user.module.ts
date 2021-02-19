import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './pages/login/login.page';

@NgModule({
  declarations: [LoginPage],
  imports: [FormsModule,ReactiveFormsModule,IonicModule.forRoot(),RouterModule.forChild([{path:'login',component:LoginPage}]),
    CommonModule
  ],
})
export class UserModule { }

