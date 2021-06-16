import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './pages/login/login.page';
import { AuthGuard } from './services/authguard.service';
import { RoleGuardService } from './services/role-guards.service';

const routes: Routes = [
  {
    path: "login",
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: "profile",
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "signup",
    loadChildren: () => import("./pages/signup/signup.module").then(m => m.SignupPageModule)
  },
  {
    path: "reset-password",
    loadChildren: () => import(
      "./pages/reset-password/reset-password.module").then(m => m.ResetPasswordPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: "users",
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersPageModule),
    canActivate: [AuthGuard, RoleGuardService]
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: "edit-user/:key",
    loadChildren: () => import('./pages/edit-user/edit-user.module').then(m => m.EditUserPageModule),
    canActivate: [AuthGuard]
  }, 
  {
    path: "not-authorized/:message",
    loadChildren: () => import('./pages/not-authorized/not-authorized.module').then(m => m.NotAuthorizedPageModule)
  }
];

@NgModule({
  declarations: [LoginPage],
  imports: [FormsModule,ReactiveFormsModule,IonicModule.forRoot(),RouterModule.forChild([{path:'login',component:LoginPage}]),
    CommonModule
  ],
})
export class UserModule { }

