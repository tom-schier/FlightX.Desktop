import { Injectable, Inject } from '@angular/core';
import { TrackModel } from '../../app/models/track.model';
import { xpLocation } from '../../app/models/airport.model';
import { Aircraft } from '../../app/models/aircraft.model';
import { WindDetails } from '../../app/models/weather.model';
import { BackEndUrl } from '../../app/models/globals.model';
import { Subject, Observable } from 'rxjs';
import { WeatherService } from '../weather/weather.service';
import { iLocationService } from '../../interfaces/iLocationService';

@Injectable({
  providedIn: 'root'
})
export class TrackService  {

  public tracks: TrackModel[];
  public waypoints: xpLocation[];

  public totalDistance: number;
  public totalTime: number;
  public totalDistanceString: string;
  public totalTimeString: string;
  private selectedAircraft: Aircraft;
  public tst: string;
  private windRows: WindDetails[];

 // options: RequestOptions;
  headers = new Headers;

  private locServiceUrl = BackEndUrl.DATA_API + 'Locations/';

  // Observable string sources
  private obTrackDetails = new Subject<TrackModel[]>();
  private obWaypointDetails = new Subject<xpLocation[]>();
  private obTotalTime = new Subject<string>();
  private obTotalDistance = new Subject<string>();

  // Observable string streams
  trackDetailsChange$ = this.obTrackDetails.asObservable();
  waypointDetailsChange$ = this.obWaypointDetails.asObservable();
  totalTimeChanged$ = this.obTotalTime.asObservable();
  totalDistanceChanged$ = this.obTotalDistance.asObservable();

  constructor(@Inject('iLocationService') private _locService: iLocationService, private _weatherSvc: WeatherService) {
      console.log('creating flight planning service');
      this.tracks = new Array();
      this.waypoints = new Array();

      this._weatherSvc.windDetailsChange$.subscribe(
          msg => {
              this.updateTracks();
          });  
      this.tst = "Tomas"
  }

  // BuildHeader(){
  //     this.headers = new Headers;
  //     this.options = new RequestOptions;
  //     let token = localStorage.getItem("access_token");
  //     this.headers.append('Content-Type', 'application/json');
  //     this.headers.append('Accept', '*/*');
  //     let st = 'Bearer ' + token;
  //     this.headers.append('Authorization', st);
  //     this.options = new RequestOptions({headers: this.headers});       
  // }


  loadWinds() {
      this.windRows = this._weatherSvc.winds;
  }

  UpdateWinds(theWinds: WindDetails[]) {
      this.loadWinds();
  }

  UpdateAircraft(theAircraft: Aircraft) {
      this.selectedAircraft = theAircraft;
  }

  AddLocation(aLoc: xpLocation, altitude: string) {
      if (aLoc == null)
          return;

     // aLoc. = altitude;
      this.waypoints.push(aLoc);
      this.obWaypointDetails.next(this.waypoints);

      this.updateTracks();
      this.obTrackDetails.next(this.tracks);
  }

  updateTracks() {
      let lastLoc: xpLocation;
      let idx = 0;
      this.totalDistance = 0;
      this.totalTime = 0;
      this.tracks = [];
      for (let aLoc of this.waypoints) {
          
          if (idx == 0) {
              
          }
          else {
              var newTrack = new TrackModel();
              newTrack.variation = -11.5;
              newTrack.headingMag
              newTrack.sector = idx;
              newTrack.fromLocation = lastLoc.code;
              newTrack.toLocation = aLoc.code;
              newTrack.altitude = "A050";
              
              if (this.selectedAircraft != null)
                  newTrack.tas = this.selectedAircraft.acSpeeds.find(x => x.name == "TAS").val;
              

              let pos1 = new google.maps.LatLng(lastLoc.latitude, lastLoc.longitude, false);
              let pos2 = new google.maps.LatLng(aLoc.latitude,aLoc.longitude, false);

              newTrack.trackTrue = this.calculateTrack(pos2, pos1);

              newTrack.headingTrue = Math.round(this.calculateHeading(pos2, pos1, newTrack));
              newTrack.gs = Math.round(this.calculateGroundspeed(newTrack));

              let tmp = this.getDistance(pos1, pos2) * 0.000539957; //convert distance from m to nm
              newTrack.ti = ((tmp / newTrack.gs)*60).toFixed(0);
              newTrack.distance = (this.getDistance(pos1, pos2) * 0.000539957).toFixed(0);
              this.totalDistance += (this.getDistance(pos1, pos2) * 0.000539957);
              this.totalTime += ((tmp / newTrack.gs) * 60);
              this.totalDistanceString = this.totalDistance.toFixed(0);
              this.totalTimeString = this.totalTime.toFixed(0);
              
              newTrack.headingMag = newTrack.headingTrue;
              this.tracks.push(newTrack);
          }
          lastLoc = aLoc;
          idx = idx + 1;
      }
      this.obTotalTime.next(this.totalTimeString);
      this.obTotalDistance.next(this.totalDistanceString);
  }

  rad(x: number) {
      return x * Math.PI / 180;
  };

  getDistance (p1: google.maps.LatLng, p2: google.maps.LatLng): number {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = this.rad(p2.lat() - p1.lat());
      var dLong = this.rad(p2.lng() - p1.lng());
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
  };

  calculateTrack(p1: google.maps.LatLng, p2: google.maps.LatLng): number {
      let λ1 = this._toRad(p1.lng());
      let λ2 = this._toRad(p2.lng());
      let φ1 = this._toRad(p1.lat());
      let φ2 = this._toRad(p2.lat());

      let y = Math.sin(λ2 - λ1) * Math.cos(φ2);
      let x = Math.cos(φ1) * Math.sin(φ2) -
          Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
      let brng = this._toDeg(Math.atan2(y, x));
      if (brng < 0)
          brng = 360 + brng;
      return Math.round(brng);
  }

  calculateHeading(p1: google.maps.LatLng, p2: google.maps.LatLng, aTrack: TrackModel): number {

      let λ1 = this._toRad(p1.lng());
      let λ2 = this._toRad(p2.lng());
      let φ1 = this._toRad(p1.lat());
      let φ2 = this._toRad(p2.lat());

      let y = Math.sin(λ2 - λ1) * Math.cos(φ2);
      let x = Math.cos(φ1) * Math.sin(φ2) -
          Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
      let brng = this._toDeg(Math.atan2(y, x));
      //let tas = this.selectedAircraft.acSpeeds.find(x => x.name == "TAS").val;
      if (brng < 0)
          brng = 360 + brng;
      if (this._weatherSvc.winds.length > 0 && aTrack.altitude != "") {
          //find the wind altitude closest to the one for the track
        //  let aWind = this._weatherSvc.winds.find(x => x.altitude == aTrack.altitude);
          //aWind.direction
          var windComponent = this._weatherSvc.FindBestWind(aTrack.altitude);
          if (windComponent == null)
          {
              return Math.round(brng);
          }
          else
          {
              // calculate the wind effect
              let wca = this.calculateWindCorrection(aTrack);
              return aTrack.trackTrue + wca;
          }            
      }
      else {
          // no wind therfore no correction
          return Math.round(brng);
      }
  }

  calculateWindCorrection(aTrack: TrackModel) {

      if (this.selectedAircraft == null)
      {
          console.log("No aircraft specified for wind correction calculation");
          return 0;
      }
      let tas = this.selectedAircraft.acSpeeds.find(x => x.name == "TAS").val;
      var windComponent = this._weatherSvc.FindBestWind(aTrack.altitude);
      var wca: number;
      var tmp: number;
      var windDir: number;
      //windDir = parseInt(windComponent.direction);


      if (windComponent.direction > aTrack.trackTrue || windComponent.direction < (aTrack.trackTrue -180))
      {
          tmp = (aTrack.trackTrue + 180 ) - windComponent.direction;

      }
      else
      {
          tmp = (aTrack.trackTrue - windComponent.direction) -180
      }

      if (Math.abs(tmp) >= 360)
      {
              wca = Math.abs(tmp) -360;
      }
      else
      {
          wca = tmp;                       
      } 

      // 2. Calculate the sin and cos for angle between track and wind
      let wcaSin = Math.sin(this._toRad(wca));
      let wcaCos = Math.cos(this._toRad(wca));  

      return this._toDeg(Math.asin((windComponent.speed*wcaSin)/tas)); 
  }


  /**
* Since not all browsers implement this we have our own utility that will
* convert from degrees into radians
*
* @param deg - The degrees to be converted into radians
* @return radians
*/
  _toRad(deg: number): number {
      return deg * Math.PI / 180;
  }

  /**
   * Since not all browsers implement this we have our own utility that will
   * convert from radians into degrees
   *
   * @param rad - The radians to be converted into degrees
   * @return degrees
   */
  _toDeg(rad: number): number {
      return rad * 180 / Math.PI;
  }

  calculateGroundspeed(aTrack: TrackModel): number
  {
      if (this.selectedAircraft == null)
      {
          console.log("No TAS available for GS calculations.");
          return 0;
      }
      //find the wind altitude closest to the one for the track
      if (this._weatherSvc.winds.length > 0) {
          let tas = this.selectedAircraft.acSpeeds.find(x => x.name == "TAS").val;

          var windComponent = this._weatherSvc.FindBestWind(aTrack.altitude);
          var wca: number;
          var tmp: number;
          var windDir: number;

          // if no wind is found return tas
          if (windComponent == null)
              return tas;

          if (windComponent.direction > aTrack.trackTrue || windComponent.direction < (aTrack.trackTrue -180))
          {
              tmp = (aTrack.trackTrue + 180 ) - windComponent.direction;

          }
          else
          {
              tmp = (aTrack.trackTrue - windComponent.direction) -180
          }

          if (Math.abs(tmp) >= 360)
          {
                  wca = Math.abs(tmp) -360;
          }
          else
          {
              wca = tmp;                       
          } 

          // 2. Calculate the sin and cos for angle between track and wind
          let wcaSin = Math.sin(this._toRad(wca));
          let wcaCos = Math.cos(this._toRad(wca));  

          let xx =  this._toDeg(Math.asin((windComponent.speed*wcaSin)/tas)); 
          return (tas* Math.cos(this._toRad(xx))) + (windComponent.speed * wcaCos)
      }
      else
          return this.selectedAircraft.acSpeeds.find(x => x.name == "TAS").val;
  }

  RemoveWaypoint(aLoc: xpLocation) {
      var idx = this.waypoints.indexOf(aLoc);
      this.waypoints.splice(idx, 1);
      this.obWaypointDetails.next(this.waypoints);

      this.updateTracks();
      this.obTrackDetails.next(this.tracks);
  }

  UpdateTrack(aTrack: TrackModel) {
      var idx = this.tracks.indexOf(aTrack);
      this.tracks[idx] = aTrack;
      this.obTrackDetails.next(this.tracks);
  }

  search(term: string): Observable<xpLocation[]> {
     // this.BuildHeader();
      if (term.length < 3)
          return;
      let outSt = encodeURI(term);
      return this._locService.getAirportLocationsBySearchString(outSt)
      // return this._http.get(this.locServiceUrl + "FindLocations/?st=" + outSt, this.options)
      //     .map((res) => res.json());            
  }

  public getAirportLocationsBySearchString(searchString: string): Observable<xpLocation[]>{
                    if (searchString == null || searchString == 'undefined')
                      return null;
                      this._locService.getAirportLocationsBySearchString(searchString);
  }

  // public getAirportLocationsBySearchString(searchString: string): Observable<xpLocation[]> {
  //             if (searchString == null || searchString == 'undefined')
  //                     return;
  //             this.BuildHeader();


  //             let params: string = [
  //                 `st=${searchString}`,
  //                 `numRecords=${15}`,
  //                 `locType=${1}`,
  //                 `filter=${7}`
  //               ].join('&');
  //               //let endpoint: string = `${this.getUrl(this.actionGetByName)}?${params}`;
                            

  //             var outSt = this.locServiceUrl + `FindLocations/?${params}`;
      
  //             return this._http.get(outSt, this.options)
  //                 .map(this.extractData);
  //             //.catch(this.handleError);
  //         }
      
  // public getWaypointsNearByEx(sthWestPos: google.maps.LatLng, northEastPos: google.maps.LatLng, locType: number): Observable<Waypoint[]> {

  //     this.BuildHeader();
  //     if (sthWestPos == null || northEastPos == null)
  //         return;
  //     let latUpp = northEastPos.lat.toString();
  //     var lngUpp = northEastPos.lng.toString();
  //     var latLow = sthWestPos.lat.toString();
  //     var lngLow = sthWestPos.lng.toString();
  //     var outSt = this.locServiceUrl + "FindWaypoints/?latUpper=" + latUpp + "&latLower=" + latLow + "&lngUpper=" + lngUpp + "&lngLower=" + lngLow + "&waypointType=" + locType;

  //     return this._http.get(outSt, this.options)
  //         .map(this.extractData);
  // }

  // getAirportsNearBy(pos: google.maps.LatLngBounds): Observable<Airport[]>{

  //     if (pos == null)
  //         return;
  //     this.BuildHeader();
  //     let latUpp = pos.getNorthEast().lat().toString();
  //     var lngUpp = pos.getNorthEast().lng().toString();
  //     var latLow = pos.getSouthWest().lat().toString();
  //     var lngLow = pos.getSouthWest().lng().toString();
  //     //var outSt = this.locServiceUrl + "DoMonkeyShit/";
  //     var outSt = this.locServiceUrl + "FindAirfields/?latUpper=" + latUpp + "&latLower=" + latLow + "&lngUpper=" + lngUpp + "&lngLower=" + lngLow  + "&filter=7";
  //     return this._http.get(outSt, this.options)
  //                 .map(this.extractData)
  //                 .catch(this.handleError);
  //     // return this._http.get(this.locServiceUrl + "AllLocs/?st=ABA")
  //     //     .map((res) => res.json());    
  // }

  getLocation(id: number): Observable<xpLocation> {
    return this._locService.getAirportByLocationID(id);
     // this.BuildHeader();
      // return this._http.get(this.locServiceUrl + "LocByID/?id=" + id, this.options)
      //     .map((res) => res.json());
  }

  getLocationByDescr(desc: string): Observable<xpLocation> {
     // this.BuildHeader();
      let outSt = encodeURI(desc);
      return this._locService.getAirportLocationsBySearchString(desc)[0];
      // return this._http.get(this.locServiceUrl + "LocByDesc/?descr=" + outSt, this.options)
      //     .map((res) => res.json());
  } 

  // private extractData(res: Response) {
  //     let body = res.json();
  //     return body;
  // }

  // private handleError (error: Response | any) {
  //     let errMsg: string;
  //     if (error instanceof Response) {
  //         const body = error.json() || '';
  //         const err = body.error || JSON.stringify(body);
  //         errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  //     } else {
  //         errMsg = error.message ? error.message : error.toString();
  //     }
  //     console.error(errMsg);
  //     return Observable.throw(errMsg);
  // }

  logError(err) {
      console.error('There was an error: ' + err);
  }
}