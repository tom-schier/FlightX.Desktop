import { iLocationService } from "../../interfaces/iLocationService";
import { Observable } from "rxjs";
import { xpLatLng } from "../../app/models/xpMaps";
import { XpLocation } from "../../app/models/airport.model";
import { from } from 'rxjs';
import { AngularFirestore } from "angularfire2/firestore";
import { Injectable } from "@angular/core";
import { CountryList } from "src/data/mapping/countries";


@Injectable()
export class FirebaseDataService implements iLocationService {

    countries: CountryList;

    private _db: AngularFirestore;

    constructor(public db: AngularFirestore) {
        this._db = db;
        this.countries = new CountryList();
    }

    private createXpLocation(elem: any): XpLocation {
        let loc = new XpLocation();
        loc._id = elem.id;
        loc.locId = elem.id;
        //loc.locId = elem.get('locId');
        loc.locName = elem.get('locName');
        loc.code = elem.get('code');
        loc.latitude = elem.get('latitude');
        loc.locType = elem.get('locType');
        loc.longitude = elem.get('longitude');
        loc.elevation = elem.get('elevation');
        loc.locCountryCode = elem.get('apCountry');
        loc.locCategoryId = elem.get('apCategoryId');
        loc.apCountry = this.countries.findCountry(loc.locCountryCode);
        return loc;
    }

    getLocationsBySearchString(searchString: string, locType: number, locCategory?: number): Observable<XpLocation[]> {
        if (searchString == "")
            return null;
        let qry = this._db.collection("Airports").ref.where("locName", ">=", searchString).orderBy("locName").limit(10);;
        return from(qry.get().then(data => {
            let locations = [];
            data.forEach(elem => {
                let ap = new XpLocation();
                ap = this.createXpLocation(elem);
                locations.push(ap);
            });
            return locations;
        }));
    }

    getLocationsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number, locCategory?: number): Observable<XpLocation[]> {
        let qry = this._db.collection("Airports").ref
            .where("longitude", "<", sthWestPos.lng)
            .where("longitude", ">", northEastPos.lng)
            .orderBy("longitude")
            .limit(100);

        return from(qry.get().then(data => {
            let locations = [];
            data.forEach(elem => {
                let ap = new XpLocation();
                ap = this.createXpLocation(elem);
                locations.push(ap);
            });
            return locations;
        }));
    }

    getLocationByLocationID(locId: number, locType: number): Observable<XpLocation[]> {
        if (locId == null)
            return null;
        let qry = this._db.collection("Airports").ref.doc(locId.toString());
        return from(qry.get().then(elem => {
            console.log("getLocationByLocationID: " + elem)
            let locations = [];

            let ap = new XpLocation();
            ap = this.createXpLocation(elem);
            locations.push(ap);

            return locations;
        }));
    }

    getLocationByCode(code: string, locType: number): Observable<XpLocation[]> {
        throw new Error("Method not implemented.");
    }


    getLocationById(objectId: string): Observable<XpLocation> {
        //let qry = this._db.collection("Airports").ref.where("_id", "==", objectId);
        let qry = this._db.collection("Airports").doc(objectId).ref;
        return from(qry.get().then(elem => {

            let ap = new XpLocation();
            if (elem) {
                ap = this.createXpLocation(elem);
            }
            return ap;
        })
        )
    }


    getLocationCount(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number, locCategory?: number): Observable<number> {
        throw new Error("Method not implemented.");
    }
}