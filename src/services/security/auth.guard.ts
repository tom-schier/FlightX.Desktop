import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../user/user.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { xpUser } from 'src/app/models/xpUser';


@Injectable()
export class AuthGuard implements CanActivate {

  public _db: AngularFirestore;
  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router
  ) {
    this._db = db;
  }



  login(email: any): Promise<any> {
    if (email == null || email == "")
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

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
        .then(user => {
          //  this.router.navigate(['/main']);
          return this.login(user.email);
        }, err => {
          // this.router.navigate(['/login']);
          return resolve(false);
        })
        .then(usr => {
           if (usr != null && usr.length > 0) {
            return resolve(true);
           } else {
             resolve(false);
           }
        }, error => {reject(false)})
    })
  }
}