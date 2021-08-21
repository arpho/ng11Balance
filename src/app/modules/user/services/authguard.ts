import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import * as firebase from "firebase/app";
import { UsersService } from "./users.service";

import "firebase/auth";
@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, public User: UsersService) {}

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.default.auth().onAuthStateChanged((user: firebase.default.User) => {
        if (user) {
          console.log('authorised',user)
          this.User.setLoggedUser(user.uid);
          resolve(true);
        } else {
          console.log('not authorized')
          this.router.navigate(["/users/login"]);
          resolve(false);
        }
      });
    });
  }
}
