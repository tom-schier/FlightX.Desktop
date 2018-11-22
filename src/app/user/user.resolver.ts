import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { UserService } from '../../services/user/user.service';
import { FirebaseUserModel } from '../models/user.model';
import { xpUser } from '../models/xpUser';

@Injectable()
export class UserResolver implements Resolve<xpUser> {

  constructor(public userService: UserService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot) : Promise<xpUser> {

    let user = new xpUser();

    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
      .then(res => {
        if (res.length > 0) {
          console.log('UserResover user is ' + JSON.stringify(res));
          return resolve(res);
        }
          
        else {
          console.log('UserResover redirect to login');
          this.router.navigate(['/login']);
          return resolve(null);        
        }
      }, err => {
        console.log('UserResover redirect to login');
        this.router.navigate(['/login']);
        return reject(err);
      })
    })
  }
}
