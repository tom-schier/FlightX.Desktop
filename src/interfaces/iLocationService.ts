import { Observable } from 'rxjs';
import { XpLocation } from '../app/models/airport.model';
import { xpLatLng } from '../app/models/xpMaps';



export interface iLocationService {

    getLocationsBySearchString(searchString: string, locType: number, locCategory?: number): Observable<XpLocation[]>;

    getLocationsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number, locCategory?: number): Observable<XpLocation[]>;

    getLocationByLocationID(locId: number, locType: number): Observable<XpLocation[]>;

    getLocationByCode(code: string, locType: number): Observable<XpLocation[]>;

    getLocationById(objectId: any): Observable<XpLocation>;

    getLocationCount(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number, locCategory?: number): Observable<number>;
}