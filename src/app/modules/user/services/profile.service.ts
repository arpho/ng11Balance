import { Injectable, ComponentFactoryResolver } from "@angular/core";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/database";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  public userProfileReference: firebase.default.database.Reference;
  public currentUser: firebase.default.User;

  constructor() {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user',user.uid)
        this.currentUser = user;
        this.userProfileReference = firebase.default.database().ref(`/userProfile/${user.uid}/`);

        console.log('profile',this.userProfileReference)
      }
    });
  }

  getUserProfileReference(): firebase.default.database.Reference {
console.log('getting usr profile reference')
    return this.userProfileReference;
  }

  updateName(firstName: string, lastName: string): Promise<any> {
    return this.userProfileReference.update({ firstName, lastName });
  }

  updateDOB(birthDate: Date): Promise<any> {
    return this.userProfileReference.update({
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
          this.userProfileReference.update({ email: newEmail });
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
