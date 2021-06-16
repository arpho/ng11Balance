import { Injectable, ComponentFactoryResolver } from "@angular/core";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/database";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  public userProfile: firebase.default.database.Reference;
  public currentUser: firebase.default.User;

  constructor() {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.default.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }

  getUserProfile(): firebase.default.database.Reference {
    return this.userProfile;
  }

  updateName(firstName: string, lastName: string): Promise<any> {
    return this.userProfile.update({ firstName, lastName });
  }

  updateDOB(birthDate: Date): Promise<any> {
    return this.userProfile.update({
      birthDate: {
        year: birthDate.getFullYear(),
        month: birthDate.getMonth(),
        day: birthDate.getDate()
      }
    });
  }

  updateEmail(newEmail: string, password: string): Promise<any> {
    const credential: firebase.default.auth.AuthCredential = firebase.default.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    );
    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        this.currentUser.updateEmail(newEmail).then(() => {
          this.userProfile.update({ email: newEmail });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    const credential: firebase.default.auth.AuthCredential = firebase.default.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
    );
    return this.currentUser
      .reauthenticateAndRetrieveDataWithCredential(credential)
      .then(() => {
        this.currentUser.updatePassword(newPassword).then(() => {
          console.log("Password Changed");
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
}
