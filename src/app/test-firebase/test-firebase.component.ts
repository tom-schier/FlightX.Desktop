import { Component, OnInit, Inject } from '@angular/core';
import { iLocationService } from '../../interfaces/iLocationService';
import { xpLatLng } from '../models/xpMaps';
import { xpUser } from '../models/xpUser';

@Component({
  selector: 'app-test-firebase',
  templateUrl: './test-firebase.component.html',
  styleUrls: ['./test-firebase.component.css']
})
export class TestFirebaseComponent implements OnInit {

  public email: string;
  public extUserId: string;
  public userName: string;

  constructor(@Inject('iLocationService') private _locService: iLocationService) {
    console.log("Created TestFirebaseComponent");
    this.email = "ttt";
    this.extUserId = "";
    this.userName = "";
  }

  ngOnInit() {
  }

  getFieldsNearBy() {
    let northEast: xpLatLng = new xpLatLng(53, 42);
    let southWest: xpLatLng = new xpLatLng(9, 0);
    this._locService.getAirportsNearBy(southWest, northEast).subscribe(data => {
      console.log("Received data from Observable: " + data);
    })
  }

  loginXp() {
    this._locService.login(this.email).subscribe((usr: xpUser[]) => {
        if (usr.length > 0) {
          this.email = usr[0].email;
          this.userName = usr[0].userName;
          this.extUserId = usr[0].externalUserID;
        }
    });
  }

}
