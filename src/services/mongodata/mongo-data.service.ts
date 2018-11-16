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

@Injectable({
  providedIn: 'root'
})
export class MongoDataService implements iLocationService {

  client: any;
  db: any;
  user: any;
  isLoggedIn: boolean;

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
                , { locType: 1 }
              ]}, { limit: 100 }).asArray()
    .then(docs => {
      console.log("Found docs", docs)
      console.log("[MongoDB Stitch] Connected to Stitch");
      return docs;
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
    .then(cnt => {
      console.log("Count returned", cnt)
      return cnt;
    }).catch(err => {
      console.error(err);
      return [];
    }));
  }

  getLocationByLocationID(locId: number, locType: number): Observable<Location> {
    return from(
      this.db.collection('locations').find({
        $and: [{locId: locId}, {locType: locType}]
      }).asArray()
    .then(cnt => {
      console.log("Count returned", cnt)
      return cnt;
    }).catch(err => {
      console.error(err);
      return [];
    }));
  }

  getLocationByCode(code: string, locType: number): Observable<Location> {
    return from(
      this.db.collection('locations').find({
        $and: [{code: code}, {locType: locType}]
      }).asArray()
    .then(cnt => {
      console.log("Count returned", cnt)
      return cnt;
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
    .then(cnt => {
      console.log("Count returned", cnt)
      return cnt;
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
