import { iLocationService } from "../../interfaces/iLocationService";
import { Observable } from "rxjs";
import { xpLatLng } from "../../app/models/xpMaps";
import { Location } from "../../app/models/airport.model";
import { from } from 'rxjs';
import { AngularFirestore } from "angularfire2/firestore";
import { Injectable } from "@angular/core";
import { CountryList } from "../../data/mapping/countries";



// getLocationsBySearchString(searchString: string, locTYpe: number): Observable<Location[]>;

// getLocationsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<Location[]>;

// getLocationByLocationID(locId: number, locType: number): Observable<Location>;

// getLocationByCode(code: string, locType: number): Observable<Location>;

// getLocationById(objectId: number): Observable<Location>;

// getLocationCount(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<number>;

@Injectable()
export class FirebaseDataService implements  iLocationService {

    token:  string;
  //  countries: CountryList;
    private _db: AngularFirestore;

    constructor(public db: AngularFirestore) {
        this._db = db;
     //   this.countries = new CountryList();
    }

    getLocationsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<Location[]> {
        
        let qry = this._db.collection("Airports").ref
            .where("longitude", "<", sthWestPos.lng)
            .where("longitude", ">", northEastPos.lng)
            .orderBy("longitude")      
            .limit(100);

        return from(qry.get().then(data => {
            let locations = [];
            data.forEach(elem => {
                let ap = new Location();
                ap._id = elem.id;
                ap.locName = elem.get('locName');
                ap.code = elem.get('code');
                ap.elevation = elem.get("elevation");
                ap.latitude = elem.get('latitude');
                ap.elevation = elem.get('elevation');
                ap.longitude = elem.get('longitude');
                ap.locCountryCode = elem.get('apCountry');
               // ap.locCountry = this.countries.findCountry(ap.locCountryCode);
                locations.push(ap);
            });
            return locations;
        }));
    }

    getLocationById(objectId: string){
        if (objectId == null)
            return null;
        let qry = this._db.collection("Airports").ref.doc(objectId);
        return from(qry.get().then(elem => {
            let ap = new Location();
            ap._id = elem.id;
            ap.locName = elem.get('locName');
            ap.code = elem.get('code');
            ap.latitude = elem.get('latitude');
            ap.locType = elem.get('locType');
            ap.elevation = elem.get('elevation');
            ap.longitude = elem.get('longitude');
            ap.longitude = elem.get('longitude');
            ap.locCountryCode = elem.get('apCountry');
          //  ap.locCountry = this.countries.findCountry(ap.locCountryCode);
            return ap;           
        }));
    }

    getLocationsBySearchString(searchString: string, locType: number): Observable<Location[]> {
        if (searchString == "")
            return null;
        let qry = this._db.collection("Airports").ref.where("locName", ">=", searchString).orderBy("locName").limit(10);;
        return from(qry.get().then(data => {
            let locations = [];
            data.forEach(elem => {
                let ap = new Location();
                ap._id = elem.id;
                ap.locId = elem.get('locId');
                ap.locName = elem.get('locName');
                ap.code = elem.get('code');
                ap.latitude = elem.get('latitude');
                ap.locType = elem.get('locType');
                ap.longitude = elem.get('longitude');
                ap.elevation = elem.get('elevation');
                ap.locCountryCode = elem.get('apCountry');
                //ap.locCountry = this.countries.findCountry(ap.locCountryCode);
                locations.push(ap);
            });
            return locations;
        }));
    }

    getWaypointsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<Location[]>{
        return null;
    }

    getLocationByLocationID(locId: number, locType: number): Observable<Location> {
        if (locId == null)
            return null;
        let qry = this._db.collection("Airports").ref.doc(locId.toString());
        return from(qry.get().then(elem => {
            let ap = new Location();
            ap._id = elem.id;
            ap.locName = elem.get('locName');
            ap.code = elem.get('code');
            ap.latitude = elem.get('latitude');
            ap.locType = elem.get('locType');
            ap.elevation = elem.get('elevation');
            ap.longitude = elem.get('longitude');
            ap.longitude = elem.get('longitude');
            ap.locCountryCode = elem.get('apCountry');
           // ap.locCountry = this.countries.findCountry(ap.locCountryCode);
            return ap;           
        }));
    }

    getLocationByCode(code: string): Observable<Location> {
        return null;
    }

    getLocationCount(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<number> {
        return null;
    }
}