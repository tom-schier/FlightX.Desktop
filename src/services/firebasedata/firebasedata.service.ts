import { iLocationService } from "../../interfaces/iLocationService";
import { Observable } from "rxjs";
import { xpLatLng } from "../../app/models/xpMaps";
import { Airport, xpLocation, Waypoint } from "../../app/models/airport.model";
import { from } from 'rxjs';
import { AngularFirestore } from "angularfire2/firestore";
import { Injectable } from "@angular/core";
import { CountryList } from "../../data/mapping/countries";
import { xpUser } from "src/app/models/xpUser";

// var algoliasearch = require('algoliasearch');
// var algoliasearch = require('algoliasearch/reactnative');
// var algoliasearch = require('algoliasearch/lite');
//  import * as algoliasearch from 'algoliasearch'; // When using TypeScript

// // or just use algoliasearch if you are using a <script> tag
// // if you are using AMD module loader, algoliasearch will not be defined in window,
// // but in the AMD modules of the page
// var client = algoliasearch('9JSHZLXNPH', '495f0235d6acb38da029eaecb9e06406');
// var index = client.initIndex('your_index_name');


@Injectable()
export class FirebaseDataService implements  iLocationService {

    token:  string;
    countries: CountryList;
    private _db: AngularFirestore;

    constructor(public db: AngularFirestore) {
        this._db = db;
        this.countries = new CountryList();
    }

    getAirportsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng): Observable<Airport[]> {
        
        let qry = this._db.collection("Airports").ref
            .where("longitude", ">", sthWestPos.lng)
            .where("longitude", "<", northEastPos.lng)
            .orderBy("longitude");

        return from(qry.get().then(data => {
            let locations = [];
            console.log("Found " + data.size + " elements");
            data.forEach(elem => {
                let lat =  parseFloat(elem.get('latitude'));
                if (lat > northEastPos.lat || lat < sthWestPos.lat) {

                } else {
                    let ap = new Airport();
                    ap.locId = elem.id;
                    ap.locName = elem.get('locName');
                    ap.code = elem.get('code');
                    ap.elevation = elem.get("elevation");
                    ap.latitude = lat
                    ap.longitude = parseFloat(elem.get('longitude'));
                    ap.elevation = elem.get('elevation');
                    ap.longitude = elem.get('longitude');
                    ap.locCountry = elem.get('apCountry');
                    locations.push(ap);
                }

            });
            return locations;
        }));
    }

    getAirportsNearByEx(sthWestPos: xpLatLng, northEastPos: xpLatLng): Observable<Airport[]> {
        return null;

    }

    getAirportLocationsBySearchString(searchString: string): Observable<xpLocation[]> {
        if (searchString == "")
            return null;
        let qry = this._db.collection("Airports").ref          
            .where("locName", ">=", searchString)   
            .where('apCategoryId', '==', 1)     
            .orderBy("locName").limit(10);

        return from(qry.get().then(data => {
                let locations = [];
                data.forEach(elem => {
                    let ap = new xpLocation();
                    ap.locId = elem.id;
                    ap.locName = elem.get('locName');
                    ap.code = elem.get('code');
                    ap.latitude = parseFloat(elem.get('latitude'));
                    ap.locType = elem.get('locType');
                    ap.longitude = parseFloat(elem.get('longitude'));
                    ap.elevation = elem.get('elevation');
                    let code = elem.get('apCountry');
                    ap.locCountry = this.countries.findCountry(code);
                    locations.push(ap);
                });
                return locations;
            }, error => {
                console.log("Error when getting data: " + error);
                return null;
            }
            )
        );
    }

    getWaypointsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<Waypoint[]>{
        return null;
    }

    getAirportByLocationID(locId: number): Observable<Airport> {
        if (locId == null)
            return null;
        let qry = this._db.collection("Airports").ref.doc(locId.toString());
        return from(qry.get().then(elem => {
            let ap = new Airport();
            ap.locId = elem.id;
            ap.locName = elem.get('locName');
            ap.code = elem.get('code');
            ap.latitude = elem.get('latitude');
            ap.locType = elem.get('locType');
            ap.elevation = elem.get('elevation');
            ap.longitude = elem.get('longitude');
            ap.longitude = elem.get('longitude');
            ap.locCountry = elem.get('apCountry');
            return ap;           
        }));
    }

    getWaypointByLocationID(locId: number): Observable<Waypoint> {
        if (locId == null)
            return null;
        let qry = this._db.collection("Airports").ref.doc(locId.toString());
        return from(qry.get().then(elem => {
            let wp = new Waypoint();
            wp.locId = elem.id;
            wp.locName = elem.get('locName');
            wp.code = elem.get('code');
            wp.elevation = elem.get('elevation');
            wp.latitude = parseFloat(elem.get('latitude'));
            wp.longitude = parseFloat(elem.get('longitude'));
            wp.locType = elem.get('locType');
            wp.locCountry = elem.get('apCountry');
            return wp;           
        }));
    }

    getLocationByLocationID(locId: number): Observable<xpLocation> {
        if (locId == null)
            return null;
        let qry = this._db.collection("Airports").ref.doc(locId.toString());
        return from(qry.get().then(elem => {
            let ap = new xpLocation();
            ap.locId = elem.id;
            ap.locName = elem.get('locName');
            ap.code = elem.get('code');
            ap.latitude = parseFloat(elem.get('latitude'));
            ap.longitude = parseFloat(elem.get('longitude'));
            ap.locType = elem.get('locType');
            ap.elevation = elem.get('elevation');
            ap.locCountry = elem.get('apCountry');
            return ap;           
        }));
    }

    login(email: string): Observable<any> {
        if (email == "")
            return null;
        let qry = this._db.collection("Users").ref          
            .where("Email", "==", email)
            .where("Target", "==", "android");
        let xpUserList = [];
        return from(qry.get().then(usr => {
                    usr.forEach(u => {
                    let ap = new xpUser();
                    ap.email = u.get('Email');
                    ap.userName = u.get('UserName')
                    ap.externalUserID =  u.get('ExternalUserID')
                    xpUserList.push(ap);
                });
                return xpUserList;
            }, error => {
                console.log("Error when getting data: " + error);
                return null;
            }
            )
        );
    }
}