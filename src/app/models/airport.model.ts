
export class xpLocation {
    locId: string;
    code: string;
    locType: number;
    locName: string;
    latitude: number;
    longitude: number;
    locCountry: string;
    countryId: number;
    elevation: number;
}

export class xpTrackingPoint extends xpLocation  {
    altitude: string;

    constructor(aLoc: xpLocation){
        super();
        this.locId = aLoc.locId;
        this.locType = aLoc.locType;
        this.latitude = aLoc.latitude;
        this.longitude = aLoc.longitude;
        this.code = aLoc.code;
        this.countryId = aLoc.countryId;
        this.locCountry = aLoc.locCountry;
        this.locName = aLoc.locName;
        this.elevation = aLoc.elevation;
    }
}


export class Airport extends xpLocation {
    AirportID: number;
    apSource: string ;
    apAddress: string;
    apContact: string;
    apSubType: string;
    apState: string;
    apRegion: string;
    apMunicipality: string;
    apScheduledSvc: string;
    apGpsCode: string;
    apIATACode: string;
    apLocalCode: string;
    apHomeLink: string;
    apWiki: string;
    apKeywords: string;
    apCategoryId: number;
}

export class Waypoint extends xpLocation {

    waypointId: number;
    longitude: number;
    wpState: string;
    wpTimezone: string;
    wpVariation: number;
    wpVariationDir: string;
    wpSource: string;
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

