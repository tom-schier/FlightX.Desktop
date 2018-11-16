import { Observable } from 'rxjs';
import { Location } from '../app/models/airport.model';
import { xpLatLng } from '../app/models/xpMaps';

export interface iLocationService {

    getLocationsBySearchString(searchString: string, locTYpe: number): Observable<Location[]>;

    getLocationsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<Location[]>;

    getLocationByLocationID(locId: number, locType: number): Observable<Location>;

    getLocationByCode(code: string, locType: number): Observable<Location>;

    getLocationById(objectId: string): Observable<Location>;

    getLocationCount(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<number>;
}