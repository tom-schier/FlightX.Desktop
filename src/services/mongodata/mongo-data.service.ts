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

@Injectable({
  providedIn: 'root'
})
export class MongoDataService implements iLocationService {

  private locServiceUrl: string;
  options: RequestOptions;
  headers = new Headers;

  client: any;

  constructor(private _http: Http) {
    this.locServiceUrl = "http://68.183.180.100/api/Locations/";
    //this.locServiceUrl = "http://localhost:3888/api/Locations/";
  }

  BuildHeader() {
    this.headers = new Headers;
    this.options = new RequestOptions;
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', '*/*');
    this.options = new RequestOptions({ headers: this.headers });
  }


  private extractLocationData(res: Response) {
    let body = res.json();
    return body;
  }

  getLocationsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<XpLocation[]> {
    let params: string = [
      `latUpper=${northEastPos.lat.toString()}`,
      `latLower=${sthWestPos.lat.toString()}`,
      `lngUpper=${northEastPos.lng.toString()}`,
      `lngLower=${sthWestPos.lng.toString()}`

    ].join('&');
    var outSt = '';
    this.BuildHeader();
    var outSt = this.locServiceUrl + "region/" + `${locType}` + "/" + `?${params}`;

    return this._http.get(outSt, this.options).pipe(
      map((res) => this.extractLocationData(res)),
      catchError(err => of(null))
    )
  }

  getLocationById(objectId: any): Observable<XpLocation> {
    if (objectId == null)
      return;
    this.BuildHeader();

    var outSt = this.locServiceUrl + `${objectId}`;
    return this._http.get(outSt, this.options).pipe(
      map((res) => this.extractLocationData(res)[0]),
      catchError(err => of(null))
    )
  }

  getLocationsBySearchString(searchString: string, locType: number): Observable<XpLocation[]> {
    if (searchString == null)
      return;
    this.BuildHeader();
    var outSt = this.locServiceUrl + "desc/" + `${locType}` + "/" + `${searchString}`;

    return this._http.get(outSt, this.options).pipe(
      map((res) => this.extractLocationData(res)),
      catchError(err => of(null))
    )
  }

  getLocationByLocationID(locId: number, locType: number): Observable<XpLocation[]> {
    if (locId == null)
      return;
    this.BuildHeader();

    var outSt = this.locServiceUrl + "locid/" + `${locType}` + "/" + `${locId}`;
    return this._http.get(outSt, this.options).pipe(
      map((res) => this.extractLocationData(res)),
      catchError(err => of(null))
    )
  }

  getLocationByCode(code: string, locType: number): Observable<XpLocation[]> {
    if (code == null)
      return;
    this.BuildHeader();

    var outSt = this.locServiceUrl + "code/" + `${code}`;

    return this._http.get(outSt, this.options).pipe(
      map((res) => this.extractLocationData(res)),
      catchError(err => of(null))
    )
  }

  getLocationCount(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<number> {
    let params: string = [
      `latUpper=${northEastPos.lat.toString()}`,
      `latLower=${sthWestPos.lat.toString()}`,
      `lngUpper=${northEastPos.lng.toString()}`,
      `lngLower=${sthWestPos.lng.toString()}`

    ].join('&');
    var outSt = '';
    this.BuildHeader();
    var outSt = this.locServiceUrl + "count/" + `${locType}` + "/" + `?${params}`;

    return this._http.get(outSt, this.options).pipe(
      map((res) => parseInt(res.text()),
      catchError(err => of(null))
      )
    )
  }
}
