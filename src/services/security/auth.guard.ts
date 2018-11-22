import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router} from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../user/user.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router
  ) {

  }

  canActivate(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
      .then(user => {
        console.log("AuthGuard Redirect to main....");
        this.router.navigate(['/main']);
        return resolve(false);
      }, err => {
        console.log("AuthGuard Redirect to login....");
        this.router.navigate(['/login']);
        return resolve(true);
      })
    })
  }
}