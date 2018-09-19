import { iLocationService } from "../../interfaces/iLocationService";
import { Observable } from "rxjs";
import { xpLatLng } from "../../app/models/xpMaps";
import { Airport, xpLocation, Waypoint } from "../../app/models/airport.model";
import { from } from 'rxjs';
import { AngularFirestore } from "angularfire2/firestore";
import { Injectable } from "@angular/core";
import { CountryList } from "../../data/mapping/countries";

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
            .where("longitude", "<", sthWestPos.lng)
            .where("longitude", ">", northEastPos.lng)
            .orderBy("longitude")      
            .limit(100);

        return from(qry.get().then(data => {
            let locations = [];
            data.forEach(elem => {
                let ap = new Airport();
                ap.locId = elem.id;
                ap.locName = elem.get('locName');
                ap.code = elem.get('code');
                ap.elevation = elem.get("elevation");
                ap.latitude = elem.get('latitude');
                ap.longitude = elem.get('longitude');
                ap.locCountry = elem.get('apCountry');
                locations.push(ap);
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
        let qry = this._db.collection("Locations").ref.where("locName", ">=", searchString).orderBy("locName").limit(10);;
        return from(qry.get().then(data => {
            let locations = [];
            data.forEach(elem => {
                let ap = new xpLocation();
                ap.locId = elem.id;
                ap.locName = elem.get('locName');
                ap.code = elem.get('code');
                ap.latitude = elem.get('latitude');
                ap.locType = elem.get('locType');
                ap.longitude = elem.get('longitude');
                let code = elem.get('apCountry');
                ap.locCountry = this.countries.findCountry(code);
                locations.push(ap);
            });
            return locations;
        }));
    }

    getWaypointsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<Waypoint[]>{
        return null;
    }

    getAirportByLocationID(locId: number): Observable<Airport> {
        if (locId == null)
            return null;
        let qry = this._db.collection("Locations").ref.doc(locId.toString());
        return from(qry.get().then(elem => {
            let ap = new Airport();
            ap.locId = elem.id;
            ap.locName = elem.get('locName');
            ap.code = elem.get('code');
            ap.latitude = elem.get('latitude');
            ap.locType = elem.get('locType');
            ap.longitude = elem.get('longitude');
            ap.locCountry = elem.get('apCountry');
            return ap;           
        }));
    }

    getWaypointByLocationID(locId: number): Observable<Waypoint> {
        if (locId == null)
            return null;
        let qry = this._db.collection("Locations").ref.doc(locId.toString());
        return from(qry.get().then(elem => {
            let wp = new Waypoint();
            wp.locId = elem.id;
            wp.locName = elem.get('locName');
            wp.code = elem.get('code');
            wp.latitude = elem.get('latitude');
            wp.longitude = elem.get('longitude');
            wp.locType = elem.get('locType');
            wp.locCountry = elem.get('apCountry');
            return wp;           
        }));
    }

    getLocationByLocationID(locId: number): Observable<xpLocation> {
        if (locId == null)
            return null;
        let qry = this._db.collection("Locations").ref.doc(locId.toString());
        return from(qry.get().then(elem => {
            let ap = new xpLocation();
            ap.locId = elem.id;
            ap.locName = elem.get('locName');
            ap.code = elem.get('code');
            ap.latitude = elem.get('latitude');
            ap.longitude = elem.get('longitude');
            ap.locType = elem.get('locType');
            ap.locCountry = elem.get('apCountry');
            return ap;           
        }));
    }
}