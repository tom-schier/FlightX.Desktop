import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { xpLatLng } from "../../app/models/xpMaps";
import { Location } from "../../app/models/airport.model";
import { from } from 'rxjs';
import { iLocationService } from "../../interfaces/iLocationService";

import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential
} from "mongodb-stitch-browser-sdk";
import { CountryList } from 'src/data/mapping/countries';

@Injectable({
  providedIn: 'root'
})
export class MongoDataService implements iLocationService {

  client: any;
  db: any;
  user: any;
  isLoggedIn: boolean;
  countries: CountryList;

  dataProj = {
    _id: {$toString: "$_id"},
    locId: 1,
    code: 1,
    locType: 1,
    locName: 1,
    latitude: 1,
    longitude: 1,
    locCountryCode: 1,
    elevation: 1,
    locSource: 1,
    locAddress: 1,
    locContact: 1,
    locState: 1,
    locRegion: 1,
    locMunicipality: 0,
    locGpsCode: 0,
    locIATACode: 0,
    locLocalCode: 0,
    locHomeLink: 0,
    locWiki: 0,
    locKeywords: 0,
    locCategoryId: 1,
    locTimezone: 0,
    locVariation: 0
  }

  constructor() {

    this.client = Stitch.initializeDefaultAppClient('flightx-mongo-gklxz');
    this.db = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas-flightx-service').db('flightx');
    this.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      this.user = user;
      this.isLoggedIn = true;
      console.log("Log in successful");
    }
      , err => { console.log("Error while connecting to Stitch: " + err); }
    );;
    this.countries = new CountryList();
  }

  getLocationsBySearchString(searchString: string, locTYpe: number): Observable<Location[]> {
    let st1 = ".*" + searchString + ".*"
    let st2 = ".*" + searchString + ".*"
    var re1 = new RegExp(st1);
    var re2 = new RegExp(st2);
    return from(
      this.db.collection('locations').find({ 
        $and: [
                { $or: [
                      { code: { $regex: re1, $options: 'i' } },
                      { locName: { $regex: re2, $options: 'i' } }
                    ]}
                , { locType: locTYpe }
              ]},  { limit: 100 }).asArray()
    .then(data => {
      console.log("getLocationsBySearchString: " + data)
      let locations = [];
      data.forEach(elem => {
          let ap = new Location();
          ap._id = elem._id;
          ap.locName = elem.locName;
          ap.code = elem.code;
          ap.elevation = elem.elevation;
          ap.latitude = elem.latitude
          ap.longitude = elem.longitude
          ap.locCountryCode = elem.locCountryCode
          locations.push(ap);
      });
      return locations;
    }).catch(err => {
      console.error(err);
      return [];
    }));
  }

  getLocationsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<Location[]> {
    return from(
      this.db.collection('locations').find({
        $and: [ { latitude: {$gte: sthWestPos.lat}},
                {longitude: {$gte: sthWestPos.lng}},
                {latitude: {$lte: northEastPos.lat}},
                {longitude: {$lte: northEastPos.lng}},
                {locType: locType}
            ]}).asArray()
    .then(data => {
      console.log("getLocationByLocationID: " + data)
      let locations = [];
      data.forEach(elem => {
          let ap = new Location();
          ap._id = elem._id;
          ap.locName = elem.locName;
          ap.code = elem.code;
          ap.elevation = elem.elevation;
          ap.latitude = elem.latitude
          ap.longitude = elem.longitude
          ap.locCountryCode = elem.locCountryCode
          locations.push(ap);
      });
      return locations;
    }).catch(err => {
      console.error(err);
      return [];
    }));
  }

  getLocationByLocationID(locId: number, locType: number): Observable<Location[]> {
    return from(
      this.db.collection('locations').find({
        $and: [{locId: locId}, {locType: locType}]
      }).asArray()
    .then(data => {
      console.log("getLocationByLocationID: " + data)
      let locations = [];
      data.forEach(elem => {
          let ap = new Location();
          ap._id = elem._id;
          ap.locName = elem.locName;
          ap.code = elem.code;
          ap.elevation = elem.elevation;
          ap.latitude = elem.latitude
          ap.longitude = elem.longitude
          ap.locCountryCode = elem.locCountryCode
          locations.push(ap);
      });
      return locations;
    }).catch(err => {
      console.error(err);
      return [];
    }));
  }

  getLocationByCode(code: string, locType: number): Observable<Location[]> {
    return from(
      this.db.collection('locations').find({
        $and: [{code: code}, {locType: locType}]
      }).asArray()
    .then(data => {
      console.log("getLocationByCode: " + data)
      let locations = [];
      data.forEach(elem => {
          let ap = new Location();
          ap._id = elem._id;
          ap.locName = elem.locName;
          ap.code = elem.code;
          ap.elevation = elem.elevation;
          ap.latitude = elem.latitude
          ap.longitude = elem.longitude
          ap.locCountryCode = elem.locCountryCode
          locations.push(ap);
      });
      return locations;
    }).catch(err => {
      console.error(err);
      return [];
    }));
  }

  getLocationById(objectId: string): Observable<Location> {
    return from(
      this.db.collection('locations').find({
        _id: objectId
      }).asArray()
    .then(elem => {
      console.log("getLocationById: " + elem)
      let ap = new Location();
      if (elem.length > 0) {
        ap._id = elem[0]._id;
        ap.locName = elem[0].locName;
        ap.code = elem[0].code;
        ap.elevation = elem[0].elevation;
        ap.latitude = elem[0].latitude
        ap.longitude = elem[0].longitude
        ap.locCountryCode = elem[0].locCountryCode
      }     
      return ap;
    }).catch(err => {
      console.error(err);
      return [];
    }));
  }
  
  getLocationCount(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<number> {
    return from(
      this.db.collection('locations').count({
        $and: [ { latitude: {$gte: sthWestPos.lat}},
                {longitude: {$gte: sthWestPos.lng}},
                {latitude: {$lte: northEastPos.lat}},
                {longitude: {$lte: northEastPos.lng}},
                {locType: locType}
            ]}).asArray()
    .then(cnt => {
      console.log("Count returned", cnt)
      return cnt;
    }).catch(err => {
      console.error(err);
      return [];
    }));
  }
}
