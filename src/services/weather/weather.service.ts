import { Injectable } from '@angular/core';
import { WindDetails } from '../../app/models/weather.model';
import { CloudDetails } from '../../app/models/weather.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService  {

  public winds: WindDetails[];
  public clouds: CloudDetails[];

  constructor() {
      console.log('Creating weather service');
      this.winds = new Array();
      this.clouds = new Array();
  }

  // Observable string sources
  private obWindDetails = new Subject<WindDetails[]>();
  private obCloudDetails = new Subject<CloudDetails[]>();

  // Observable string streams
  windDetailsChange$ = this.obWindDetails.asObservable();
  cloudDetailsChange$ = this.obCloudDetails.asObservable();

  // Service message commands
  AddWind(aWind: WindDetails) {
      var newWind = new WindDetails();
      newWind = aWind;
      this.winds.push(aWind);
      this.obWindDetails.next(this.winds);
  }

  RemoveWind(aWind: WindDetails) {
      var idx = this.winds.indexOf(aWind);
      this.winds.splice(idx, 1);
      this.obWindDetails.next(this.winds);
  }

  UpdateWind(aWind: WindDetails) {
      var idx = this.winds.indexOf(aWind);
      var theWind = this.winds.find(x => x.id == aWind.id);
      this.winds[idx] = aWind;
      this.obWindDetails.next(this.winds);
  }

  // accept an altitude string like A010 and return the wind Component as a number for the wind closest to that altitude
  FindBestWind(altitude: string) {
      var regex = "[A][0-9][0-9][0-9]";
      return this.winds.find(x => x.altitude == altitude);
  }

  // Service message commands
  AddCloud(aCloud: CloudDetails) {
      var newCloud = new CloudDetails();
      newCloud = aCloud;
      this.clouds.push(aCloud);
      this.obCloudDetails.next(this.clouds);
  }

  RemoveCloud(aCloud: CloudDetails) {
      var idx = this.clouds.indexOf(aCloud);
      this.clouds.splice(idx);
      this.obCloudDetails.next(this.clouds);
  }

  UpdateCloud(aCloud: CloudDetails) {
      var idx = this.clouds.indexOf(aCloud);
      var theCloud = this.clouds.find(x => x == aCloud);

      this.obCloudDetails.next(this.clouds);
  }

  logError(err) {
      console.error('There was an error: ' + err);
  }

  //getWindForSector(aSector: number, aAltitude: number) {
  //    return this.winds.find(wnd => wnd.sector == aSector && wnd.altitude == aAltitude);
  //}

}

