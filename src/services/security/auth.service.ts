import { Injectable } from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {


  constructor(
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  doFacebookLogin() {
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

  doTwitterLogin() {
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

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
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


  doSendEmailLoginLink(email) {
    var actionCodeSettings = {
      'url': 'https://flightx-171107.firebaseapp.com/', // Here we redirect back to this same page.
      'handleCodeInApp': true // This must be true.
    };

    return new Promise<any>((resolve, reject) => {
      firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
        .then(res => {
          window.localStorage.setItem('emailForSignIn', email);
          resolve(res);
        }, err => reject(err))
    })
  }

  doCompleteSignInViaEmail(email: string, url: string) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailLink(email, url)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    });
  }

  doRegister(value) {
    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: 'https://flightx-171107.firebaseapp.com/',
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
      firebase.auth().sendSignInLinkToEmail(value, actionCodeSettings)
        .then(res => {
          window.localStorage.setItem('emailForSignIn', value);
          resolve(res);
        }, err => reject(err))
    })
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.username, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    })
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      }
      else {
        reject();
      }
    });
  }



}