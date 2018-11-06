import { Injectable } from "@angular/core";
//import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { xpUser } from "src/app/models/xpUser";

@Injectable()
export class UserService {

  private currentUser: xpUser;

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
  }

  login = (email: any): Promise<any> => {
    console.log("Checking FlightX user...login()");
    if (email == "")
      return null;
    let qry = this.db.collection("FlightXUsers").ref
      .where("Email", "==", email)
      .where("Target", "==", "android");
    let xpUserList = [];
    return qry.get().then(usr => {
      usr.forEach(u => {
        let ap = new xpUser();
        ap.email = u.get('Email');
        ap.userName = u.get('UserName')
        ap.externalUserID = u.get('ExternalUserID')
        xpUserList.push(ap);
      });
      if (xpUserList.length > 0)
        this.currentUser = xpUserList[0];
      else 
        this.currentUser = null;
      return new Promise(resolve => { resolve(xpUserList) });
    }, error => {
      console.log("Error when getting data: " + error);
      return null;
    }
    )
  }
  getCurrentUser = ()=> {
    console.log("Checking current user...getCurrentUser()");
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          
          this.login(user.email).then(u => {
            if (u.length > 0) {
              resolve(u);
            } else {
              reject('Not authorised');
            }
          });
          //return this.login(user.email);
         
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  updateCurrentUser(value) {
    return new Promise((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(res => {
        resolve()
      }, err => reject(err))
    })
  }
}