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

  private getQueryForGeoFenceRange(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number, locCategory?: number): any {
    let query = {};
    if (locCategory) {
      query = {
        $and: [{ latitude: { $gte: sthWestPos.lat } },
        { longitude: { $gte: sthWestPos.lng } },
        { latitude: { $lte: northEastPos.lat } },
        { longitude: { $lte: northEastPos.lng } },
        { locType: locType },
        { locCategoryId: locCategory }
        ]
      };
    } else {
      query = {
        $and: [{ latitude: { $gte: sthWestPos.lat } },
        { longitude: { $gte: sthWestPos.lng } },
        { latitude: { $lte: northEastPos.lat } },
        { longitude: { $lte: northEastPos.lng } },
        { locType: locType }
        ]
      };
    }
    return query;
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
    throw new Error("Method not implemented.");
  }


  /****************************OLD CODE */
  // client: any;
  // db: any;
  // user: any;
  // isLoggedIn: boolean;
  // countries: CountryList;

  // dataProj = {
  //   _id: {$toString: "$_id"},
  //   locId: 1,
  //   code: 1,
  //   locType: 1,
  //   locName: 1,
  //   latitude: 1,
  //   longitude: 1,
  //   locCountryCode: 1,
  //   elevation: 1,
  //   locSource: 1,
  //   locAddress: 1,
  //   locContact: 1,
  //   locState: 1,
  //   locRegion: 1,
  //   locMunicipality: 0,
  //   locGpsCode: 0,
  //   locIATACode: 0,
  //   locLocalCode: 0,
  //   locHomeLink: 0,
  //   locWiki: 0,
  //   locKeywords: 0,
  //   locCategoryId: 1,
  //   locTimezone: 0,
  //   locVariation: 0
  // }

  // constructor() {

  //   this.client = Stitch.initializeDefaultAppClient('flightx-mongo-gklxz');
  //   this.db = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas-flightx-service').db('flightx');
  //   this.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
  //     this.user = user;
  //     this.isLoggedIn = true;
  //     console.log("Log in successful");
  //   }
  //     , err => { console.log("Error while connecting to Stitch: " + err); }
  //   );;
  //   this.countries = new CountryList();
  // }

  // private getQueryForGeoFenceRange(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number, locCategory?: number): any {
  //   let query = {};
  //   if (locCategory) {
  //     query = {
  //       $and: [ { latitude: {$gte: sthWestPos.lat}},
  //               {longitude: {$gte: sthWestPos.lng}},
  //               {latitude: {$lte: northEastPos.lat}},
  //               {longitude: {$lte: northEastPos.lng}},
  //               {locType: locType},
  //               {locCategoryId: locCategory}
  //           ]};
  //   } else {
  //     query = {
  //       $and: [ { latitude: {$gte: sthWestPos.lat}},
  //               {longitude: {$gte: sthWestPos.lng}},
  //               {latitude: {$lte: northEastPos.lat}},
  //               {longitude: {$lte: northEastPos.lng}},
  //               {locType: locType}
  //           ]};
  //   }
  //   return query; 
  // }

  // private createXpLocation(elem: any) : XpLocation {
  //   let loc = new XpLocation();
  //   loc._id = elem._id;
  //   loc.locId = elem.locId;
  //   loc.locName = elem.locName;
  //   loc.code = elem.code;
  //   loc.locType = elem.locType;
  //   loc.elevation = elem.elevation;
  //   loc.latitude = elem.latitude;
  //   loc.longitude = elem.longitude;
  //   loc.locCountryCode = elem.locCountryCode;
  //   loc.locCategoryId = elem.locCategoryId;
  //   loc.apCountry = this.countries.findCountry(elem.locCountryCode); 
  //   return loc;
  // }

  // getLocationsBySearchString(searchString: string, locType: number, locCategory?: number): Observable<XpLocation[]> {

  //   let st1 = ".*" + searchString + ".*"
  //   let st2 = ".*" + searchString + ".*"
  //   var re1 = new RegExp("^" + st1.toLowerCase(), "i");
  //   var re2 = new RegExp("^" + st2.toLowerCase(), "i");
  //   let query = {};
  //   if (locCategory) {
  //     query = { 
  //       $and: [
  //               { $or: [
  //                     { code: { $regex: re1} },
  //                     { locName: { $regex: re2} }
  //                   ]}
  //               , { locType: locType }
  //               , { locCategoryId: locCategory }
  //             ]
  //           };
  //   } else {
  //     query ={ 
  //       $and: [
  //               { $or: [
  //                     { code: { $regex: re1, $options: 'i' } },
  //                     { locName: { $regex: re2, $options: 'i' } }
  //                   ]}
  //               , { locType: locType }
  //             ]
  //           };
  //   }

  //   return from(
  //     this.db.collection('locations').find(query,  {$orderby: {locCategoryId: 10}},  { limit: 100 }).asArray()
  //   .then(data => {
  //     console.log("getLocationsBySearchString: " + data)
  //     let locations = [];
  //     data.forEach(elem => {
  //         let loc = this.createXpLocation(elem);
  //         locations.push(loc);
  //     });
  //     return locations;
  //   }).catch(err => {
  //     console.error(err);
  //     return [];
  //   }));
  // }

  // getLocationsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number, locCategory?: number): Observable<XpLocation[]> {

  //   let query = this.getQueryForGeoFenceRange(sthWestPos, northEastPos, locType, locCategory);
  //   return from(
  //     this.db.collection('locations').find(query, {$orderby: {locCategoryId: 10}}).asArray()
  //   .then(data => {
  //     console.log("getLocationByLocationID: " + data)
  //     let locations = [];
  //     data.forEach(elem => {
  //       let loc = this.createXpLocation(elem);
  //       locations.push(loc);
  //     });
  //     return locations;
  //   }).catch(err => {
  //     console.error(err);
  //     return [];
  //   }));
  // }

  // getLocationByLocationID(locId: number, locType: number): Observable<XpLocation[]> {
  //   return from(
  //     this.db.collection('locations').find({
  //       $and: [{locId: locId}, {locType: locType}]
  //     }).asArray()
  //   .then(data => {
  //     console.log("getLocationByLocationID: " + data)
  //     let locations = [];
  //     data.forEach(elem => {
  //       let loc = this.createXpLocation(elem);
  //       locations.push(loc);
  //     });
  //     return locations;
  //   }).catch(err => {
  //     console.error(err);
  //     return [];
  //   }));
  // }

  // getLocationByCode(code: string, locType: number): Observable<XpLocation[]> {
  //   return from(
  //     this.db.collection('locations').find({
  //       $and: [{code: code}, {locType: locType}]
  //     }).asArray()
  //   .then(data => {
  //     console.log("getLocationByCode: " + data)
  //     let locations = [];
  //     data.forEach(elem => {
  //       let loc = this.createXpLocation(elem);
  //       locations.push(loc);
  //     });
  //     return locations;
  //   }).catch(err => {
  //     console.error(err);
  //     return [];
  //   }));
  // }

  // getLocationById(objectId: string): Observable<XpLocation> {
  //   return from(
  //     this.db.collection('locations').find({
  //       _id: objectId
  //     }).asArray()
  //   .then(elem => {
  //     console.log("getLocationById: " + elem)
  //     let loc = null
  //     if (elem.length > 0) {
  //         loc = this.createXpLocation(elem[0])
  //     }     
  //     return loc;
  //   }).catch(err => {
  //     console.error(err);
  //     return [];
  //   }));
  // }

  // getLocationCount(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number, locCategory?: number): Observable<number> {

  //   let query = this.getQueryForGeoFenceRange(sthWestPos, northEastPos, locType, locCategory);
  //   return from(
  //     this.db.collection('locations').count(query)
  //   .then(cnt => {
  //     console.log("Count returned", cnt)
  //     return cnt;
  //   }).catch(err => {
  //     console.error(err);
  //     return [];
  //   }));
  // }
}
