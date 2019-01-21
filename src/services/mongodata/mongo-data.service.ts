import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { xpLatLng } from "../../app/models/xpMaps";
import { XpLocation } from "../../app/models/airport.model";
import { from } from 'rxjs';
import { iLocationService } from "../../interfaces/iLocationService";
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential
} from "mongodb-stitch-browser-sdk";
import { CountryList } from 'src/data/mapping/countries';
import { map, catchError } from 'rxjs/operators';
import { XpLocationType } from 'src/app/models/globals.model';
import { XpAirfieldTypes, DataLimits } from 'src/app/common/globals';

@Injectable({
  providedIn: 'root'
})
export class MongoDataService implements iLocationService {

  private locServiceUrl: string;
  options: RequestOptions;
  headers = new Headers;
  countries: CountryList;
  client: any;

  constructor(private _http: Http) {
    this.locServiceUrl = "http://68.183.180.100/api/Locations/";
    //this.locServiceUrl = "http://localhost:3888/api/Locations/";
    this.countries = new CountryList();
  }

  BuildHeader() {
    this.headers = new Headers;
    this.options = new RequestOptions;
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', '*/*');
    //let st = 'Bearer ' + this._usrAccountSv.accessToken;
    //this.headers.append('Authorization', st);
    this.options = new RequestOptions({ headers: this.headers });
  }



  private extractLocationData(res: Response): XpLocation[] {
    let body = res.json();
    let locList = [];
    let length = body.length;
    for (let i = 0; i < length; i++) {
      var aLoc = this.createXpLocation(body[i]);
      locList.push(aLoc);
    }
    return locList;
  }

  private createXpLocation(elem: any): XpLocation {
    let loc = new XpLocation();
    loc._id = elem._id;
    loc.locId = elem.locId;
    loc.locName = elem.locName;
    loc.code = elem.code;
    loc.latitude = elem.latitude;
    loc.locType = elem.locType;
    loc.longitude = elem.longitude;
    loc.elevation = elem.elevation;
    loc.locCountryCode = elem.locCountryCode;
    loc.locCategoryId = elem.locCategoryId;
    loc.apCountry = this.countries.findCountry(loc.locCountryCode);
    return loc;
}

  getLocationsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<any> {
    let filter = 0;
    if (locType != XpLocationType.LOCTYPE_AIRFIELD)
      filter = XpAirfieldTypes.WAYPOINT_VFR;

    let params: string = [
      `latUpper=${northEastPos.lat.toString()}`,
      `latLower=${sthWestPos.lat.toString()}`,
      `lngUpper=${northEastPos.lng.toString()}`,
      `lngLower=${sthWestPos.lng.toString()}`

    ].join('&');
    var outSt = '';
    this.BuildHeader();
    var outSt = this.locServiceUrl + "region/" + `${locType}` + "/" + `${filter}` + "/" + `?${params}` ;

    return this._http.get(outSt, this.options).pipe(
      map((res) => this.extractLocationData(res)),
      catchError(err => of(this.handleError(err)))
    )
  }

  getLocationById(objectId: any): Observable<any> {
    if (objectId == null)
      return;
    this.BuildHeader();

    var outSt = this.locServiceUrl + `${objectId}`;
    return this._http.get(outSt, this.options).pipe(
      map((res) => this.extractLocationData(res)[0]),
      catchError(err => of(this.handleError(err)))
    )
  }

  getLocationsBySearchString(searchString: string, locType: number): Observable<any> {
    if (searchString == null)
      return;
    let cnt = DataLimits.MAX_NUMBER_RECORD_RETURN;
    let filter = 0;
    if (locType != XpLocationType.LOCTYPE_AIRFIELD)
      filter = XpAirfieldTypes.WAYPOINT_VFR;

    this.BuildHeader();
    var outSt = this.locServiceUrl + "desc/" + `${locType}` + "/" + `${searchString}` + "/" + `${cnt}` + "/" + `${filter}`;

    return this._http.get(outSt, this.options).pipe(
      map((res) => this.extractLocationData(res)),
      catchError(err => of(this.handleError(err)))
    )
  }

  getLocationByLocationID(locId: number, locType: number): Observable<any> {
    if (locId == null)
      return;
    this.BuildHeader();

    var outSt = this.locServiceUrl + "locid/" + `${locType}` + "/" + `${locId}`;
    return this._http.get(outSt, this.options).pipe(
      map((res) => this.extractLocationData(res)),
      catchError(err => of(this.handleError(err)))
    )
  }

  getLocationByCode(code: string, locType: number): Observable<any> {
    if (code == null)
      return;
    this.BuildHeader();

    var outSt = this.locServiceUrl + "code/" + `${code}`;

    return this._http.get(outSt, this.options).pipe(
      map((res) => this.extractLocationData(res)),
      catchError(err => of(this.handleError(err)))
    )
  }

  getLocationCount(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<number> {
    let filter = 0;
    if (locType != XpLocationType.LOCTYPE_AIRFIELD)
      filter = XpAirfieldTypes.WAYPOINT_VFR;

    let params: string = [
      `latUpper=${northEastPos.lat.toString()}`,
      `latLower=${sthWestPos.lat.toString()}`,
      `lngUpper=${northEastPos.lng.toString()}`,
      `lngLower=${sthWestPos.lng.toString()}`

    ].join('&');
    var outSt = '';
    this.BuildHeader();
    var outSt = this.locServiceUrl + "count/" + `${locType}` + "/" + `${filter}` + "/"+ `?${params}`;

    return this._http.get(outSt, this.options).pipe(
      map((res) => parseInt(res.text()),
      catchError(err => of(this.handleError(err)))
      )
    )
  }

  
    private handleError(error: Response | any): Observable<any> {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            if (err.status > 299) {
                //this.status.setLoginStatus(LoginStatus.LOGIN_FAILED);                
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
