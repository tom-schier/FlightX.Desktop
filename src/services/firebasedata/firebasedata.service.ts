import { iLocationService } from "../../interfaces/iLocationService";
import { Observable } from "rxjs";
import { xpLatLng } from "../../app/models/xpMaps";
import { Airport, xpLocation, Waypoint } from "../../app/models/airport";
import { from } from 'rxjs';
import { AngularFirestore } from "angularfire2/firestore";
import { Injectable } from "@angular/core";

@Injectable()
export class FirebaseDataService implements  iLocationService {

    token:  string;
    private _db: AngularFirestore;
    // SetCompleterDataSource(): CompleterData;

    constructor(public db: AngularFirestore) {
        this._db = db;
    }

    getAirportsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng): Observable<Airport[]> {
        
        let qry = this._db.collection("Airports").ref
            .where("longitude", "<", sthWestPos.lng)
            .where("longitude", ">", northEastPos.lng)
            .orderBy("longitude")      
            .limit(100);

        return from(qry.get().then(data => {
            let locations = [];
            data.forEach(elem => {
                let ap = new Airport();
                ap.locId = parseInt(elem.id);
                ap.locName = elem.get('locName');
                ap.code = elem.get('code');
                ap.elevation = elem.get("elevation");
                ap.latitude = elem.get('latitude');
                ap.longitude = elem.get('longitude');
                ap.locCountry = elem.get('locCountry');
                locations.push(ap);
            });
            return locations;
        }));
    }

    getAirportsNearByEx(sthWestPos: xpLatLng, northEastPos: xpLatLng): Observable<Airport[]> {
        return null;

    }

    getAirportLocationsBySearchString(searchString: string): Observable<xpLocation[]> {
        let qry = this._db.collection("Airports").ref.where("locName", ">=", searchString).orderBy("locName").limit(10);;
        return from(qry.get().then(data => {
            let locations = [];
            data.forEach(elem => {
                let ap = new xpLocation();
                ap.locId = parseInt(elem.id);
                ap.locName = elem.get('locName');
                ap.code = elem.get('code');
                ap.latitude = elem.get('latitude');
                ap.longitude = elem.get('longitude');
                ap.locCountry = elem.get('locCountry');
                locations.push(ap);
            });
            return locations;
        }));
    }

    getWaypointsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<Waypoint[]>{
        return null;
    }

    getAirportByLocationID(locId: number): Observable<Airport> {
        let qry = this._db.collection("Airports").ref.doc(locId.toString());
        return from(qry.get().then(elem => {
            let ap = new Airport();
            ap.locId = parseInt(elem.id);
            ap.locName = elem.get('locName');
            ap.code = elem.get('code');
            ap.latitude = elem.get('latitude');
            ap.longitude = elem.get('longitude');
            ap.locCountry = elem.get('locCountry');
            return ap;           
        }));
    }

    getWaypointByLocationID(locId: number): Observable<Waypoint> {
        let qry = this._db.collection("Locations").ref.doc(locId.toString());
        return from(qry.get().then(elem => {
            let wp = new Waypoint();
            wp.locId = parseInt(elem.id);
            wp.locName = elem.get('locName');
            wp.code = elem.get('code');
            wp.latitude = elem.get('latitude');
            wp.longitude = elem.get('longitude');
            wp.locCountry = elem.get('locCountry');
            return wp;           
        }));
    }

    getLocationByLocationID(locId: number): Observable<xpLocation> {
        let qry = this._db.collection("Locations").ref.doc(locId.toString());
        return from(qry.get().then(elem => {
            let ap = new xpLocation();
            ap.locId = parseInt(elem.id);
            ap.locName = elem.get('locName');
            ap.code = elem.get('code');
            ap.latitude = elem.get('latitude');
            ap.longitude = elem.get('longitude');
            ap.locCountry = elem.get('locCountry');
            return ap;           
        }));
    }

    private extractData(res: Response) {
        let body = res.json();
        return body;
    }
}