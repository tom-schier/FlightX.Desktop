import { Component, OnInit, Inject } from '@angular/core';
import { iLocationService } from '../../interfaces/iLocationService';
import { xpLatLng } from '../models/xpMaps';
import { XpLocationType } from '../models/globals.model';

@Component({
  selector: 'app-test-firebase',
  templateUrl: './test-firebase.component.html',
  styleUrls: ['./test-firebase.component.css']
})
export class TestFirebaseComponent implements OnInit {

  constructor(@Inject('iLocationService') private _locService: iLocationService) { }

  ngOnInit() {
  }

  getFieldsNearBy() {
    let northEast: xpLatLng = new xpLatLng(53, 42);
    let southWest: xpLatLng = new xpLatLng(9, 0);
    this._locService.getLocationsNearBy(southWest, northEast, XpLocationType.LOCTYPE_AIRFIELD).subscribe(data => {
      console.log("REceived data from Observable: " + data);
    })
  }

}
