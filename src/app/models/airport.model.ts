export class Location {
    _id: string;
    locId: number;
    code: string;
    locType: number;
    locName: string;
    latitude: number;
    longitude: number;
    locCountryCode: string;
    elevation: number;
    locSource: string;
    locAddress: string;
    locContact: string;
    locState: string;
    locRegion: string;
    locMunicipality: string;
    locGpsCode: string;
    locIATACode: string;
    locLocalCode: string;
    locHomeLink: string;
    locWiki: string;
    locKeywords: string;
    locCategoryId: number;
    locTimezone: string;
    locVariation: number;

    locCountry: string;
}

export class xpTrackingPoint extends Location  {

    altitude: string;

    constructor(aLoc: Location){
        super();
        this.locId = aLoc.locId;
        this.locType = aLoc.locType;
        this.latitude = aLoc.latitude;
        this.longitude = aLoc.longitude;
        this.code = aLoc.code;
        this.locCountryCode = aLoc.locCountryCode;
        this.locName = aLoc.locName;
        this.elevation = aLoc.elevation;

        this.locCountry = aLoc.locCountry;
    }
}

export class ApCategoryId {
    static SMALL_AIRPORT: number = 1;
    static MEDIUM_AIRPORT: number = 2;
    static LARGE_AIRPORT: number = 3;
    static CLOSED: number = 4;
    static SEAPLANE_BASE: number = 5;
    static HELIPORT: number = 6;
    static BALLOONPORT: number = 7;
}

