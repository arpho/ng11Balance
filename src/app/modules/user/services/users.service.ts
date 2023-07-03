// tslint:disable: quotemark
import { Injectable, OnInit } from "@angular/core";
import * as firebase from "firebase";
import { ItemServiceInterface } from "../../item/models/ItemServiceInterface";
import { UserModel } from "../models/userModel";
import { ItemModelInterface } from "../../item/models/itemModelInterface";
import * as admin from "firebase-admin";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class UsersService implements ItemServiceInterface, OnInit {
  public usersRef: firebase.default.database.Reference;
  items_list: Array<UserModel> = []
  _items: BehaviorSubject<Array<UserModel>> = new BehaviorSubject([])
  _loggedUser: BehaviorSubject<UserModel> = new BehaviorSubject(new UserModel)
  loggedUser: Observable<UserModel> = this._loggedUser.asObservable()


  readonly items: Observable<Array<UserModel>> = this._items.asObservable()
static loggedUser:UserModel
  constructor() {
    this.usersRef = firebase.default.database().ref("/userProfile");
    this.loadItems()

  }
  populateItems = (UsersListSnapshot) => {
    this.items_list = [];
    UsersListSnapshot.forEach(snap => {
      const user = new UserModel(undefined, snap.key).load(snap.val())
      user.key = snap.key // alcuni item non hanno il campo key
      this.items_list.push(user);
      if (user.key === '') {
      }
    });
    this._items.next(this.items_list)
  }
  ngOnInit(): void {
  }

  loadItems() {
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        this.usersRef = firebase.default.database().ref(`/userProfile/`);
        this.usersRef.on('value', this.populateItems);
      }
    });
  }

  getItem(key: string) {
    if (this.usersRef) {
      return this.usersRef.child(key);
    }
  }

  getLoggedUser() {
    return this.loggedUser;
  }

  setLoggedUser(user: UserModel) {
    console.log('setting logged user', user)
    this._loggedUser.next(user);
    UsersService.loggedUser=user
    return this.loggedUser;
  }

  deleteItem(key: string) {
    return this.usersRef.child(key).remove();
  }

  getDummyItem() {
    return new UserModel();
  }

  createItem(item: ItemModelInterface) {
    return this.usersRef.push(item.serialize());
  }

  getEntitiesList(): firebase.default.database.Reference {
    return this.usersRef;
  }

  updateItem(item: ItemModelInterface) {
    return this.usersRef.child(item.key).update(item.serialize());
  }
}
