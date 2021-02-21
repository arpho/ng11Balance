import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import * as firebase from "firebase/app";
import "firebase/auth";
import { UsersService } from "./users.service";
@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private users: UsersService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    console.log("can activate");
    return new Promise((resolve, reject) => {
      firebase.default.auth().onAuthStateChanged((user: firebase.default.User) => {
        if (user) {
          console.log("user from auth", user);
          this.users.setLoggedUser(user.uid);
          console.log(this.users.getLoggedUser(), "logged user");
          resolve(true);
        } else {
          console.log("User is not logged in");
          this.router.navigate(["/user/login"]);
          console.log("routing to the login");
          resolve(false);
        }
      });
    });
  }
}
