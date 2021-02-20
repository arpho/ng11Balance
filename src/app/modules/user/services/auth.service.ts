import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.default.auth().signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return firebase.default.auth().sendPasswordResetEmail(email);
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase.default
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUserCredential => {
        newUserCredential.user.sendEmailVerification();
        firebase
        .default
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/email`)
          .set(email);
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  logoutUser(): Promise<void> {
    const userId: string = firebase.default.auth().currentUser.uid;
    firebase
    .default
      .database()
      .ref(`/userProfile/${userId}`)
      .off();
    return firebase.default.auth().signOut();
  }

}