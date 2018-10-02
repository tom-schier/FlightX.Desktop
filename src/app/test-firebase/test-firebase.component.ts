import { Component, OnInit, Inject } from '@angular/core';
import { iLocationService } from '../../interfaces/iLocationService';
import { xpLatLng } from '../models/xpMaps';

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
    this._locService.getAirportsNearBy(southWest, northEast).subscribe(data => {
      console.log("REceived data from Observable: " + data);
    })
  }

}
