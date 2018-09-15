import { Observable } from 'rxjs';
import { xpLocation, Airport, Waypoint } from '../app/models/airport.model';
import { xpLatLng } from '../app/models/xpMaps';

export interface iLocationService {

    token:  string;

    getAirportsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng): Observable<Airport[]>;

    getAirportsNearByEx(sthWestPos: xpLatLng, northEastPos: xpLatLng): Observable<Airport[]>;

    getAirportLocationsBySearchString(searchString: string): Observable<xpLocation[]>;

    getWaypointsNearBy(sthWestPos: xpLatLng, northEastPos: xpLatLng, locType: number): Observable<Waypoint[]>;

    getAirportByLocationID(locId: number): Observable<Airport>;

    getWaypointByLocationID(locId: number): Observable<Waypoint>;

    getLocationByLocationID(locId: number): Observable<xpLocation>;
}