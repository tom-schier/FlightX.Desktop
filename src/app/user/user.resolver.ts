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
        if (res.length > 0)
          return resolve(user);
        else {
          this.router.navigate(['/login']);
          return resolve(null);        
        }
        // if(res.providerData[0].providerId == 'password'){
        //   user.image = 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png';
        //   user.name = res.displayName;
        //   user.provider = res.providerData[0].providerId;
        //   return resolve(user);
        // }
        // else{
        //   user.image = res.photoURL;
        //   user.name = res.displayName;
        //   user.provider = res.providerData[0].providerId;
        //   return resolve(user);
        // }
      }, err => {
        this.router.navigate(['/login']);
        return reject(err);
      })
    })
  }
}
