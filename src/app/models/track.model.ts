import { WindDetails } from "./weather.model";

export class TrackModel {
    idx: number;
    windIdx: number;
    altitude: string;
    fromLocation: string;
    toLocation: string;
    distance: string;
    headingTrue: number;
    headingMag: number;
    trackTrue: number;  
    trackMag: number;
    tas: number;
    gs: number;
    ti: string;
    isReadOnly: boolean;
    variation: number;
    trackWind: WindDetails;
    sector: number;
    btnEditClass: string;
    btnRemoveClass: string;
    marker: google.maps.LatLng;
    fromLocIdx: number;
    toLocIdx: number;
    fuelUsed: number;
}