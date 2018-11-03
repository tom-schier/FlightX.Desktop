import { Injectable } from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { xpUser } from "src/app/models/xpUser";
import { FirebaseUserModel } from "src/app/models/user.model";
import { TrackDataComponent } from "src/app/track-data/track-data.component";
import { AngularFirestore } from "angularfire2/firestore";

@Injectable()
export class AuthService {

  public currenUser: xpUser;
  public _db: AngularFirestore;

  constructor(public afAuth: AngularFireAuth, public db: AngularFirestore,)
  {
      console.log("Constructor authService");
      this.currenUser = new xpUser();
      this._db = db;
  }

  doFacebookLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doTwitterLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  login(email: any): Promise<any> {
    if (email == "")
      return null;
    let qry = this._db.collection("FlightXUsers").ref
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
      return new Promise(resolve => { resolve(xpUserList) });
    }, error => {
      console.log("Error when getting data: " + error);
      return null;
    }
    )
  }

  doGoogleLogin(){
    // return new Promise<any>((resolve, reject) => {
    //   let provider = new firebase.auth.GoogleAuthProvider();
    //   provider.addScope('profile');
    //   provider.addScope('email');
    //   this.afAuth.auth
    //   .signInWithPopup(provider)
    //   .then(res => {
    //     //this.currenUser.email = res.user.email;
    //     //this.currenUser.userName = res.user.displayName;
    //     return new Promise(resolve => { resolve(res.user.email) });
    //    // return new Promise(res.user.email);
    //   }, err => {
    //     console.log(err);
    //     return null;
    //   })
    //   .then(res => {
    //       return this.login(res);
    //   }, err => {
    //      return null;
    //   })
    // })
  //  return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      return this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        //this.currenUser.email = res.user.email;
        //this.currenUser.userName = res.user.displayName;
        return new Promise(resolve => { resolve(res.user.email) });
       // return new Promise(res.user.email);
      }, err => {
        console.log(err);
        return null;
      })
      .then(res => {
          return this.login(res);
      }, err => {
         return null;
      })
  //  })
  }

  doRegister(value){
    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: 'https://xptraining-bfa66.firebaseapp.com',
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.example.ios'
      },
      android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
      }
    };
    return new Promise<any>((resolve, reject) => {
      firebase.auth().sendSignInLinkToEmail(value.username, actionCodeSettings)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.username, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        this.afAuth.auth.signOut()
        resolve();
      }
      else{
        reject();
      }
    });
  }


}