// export class XpLocType {
//     public static get CAT_AIRFIELD_LOCATION():number { return 1; } 
//     public static get CAT_WAYPOINT_LOCATION():number { return 2; } 
//     public static get LOCTYPE_IFR_WAYPOINT():number { return 3; } 
// }

export class xpLocation {
    locId: string;
    code: string;
    locType: number;
    locName: string;
    latitude: number;
    longitude: number;
    locCountry: string;
    countryId: number;
}


export class Airport extends xpLocation {

    //locId: number;
    AirportID: number;
    //code: string;
    //locName: string;
    //latitude: number;
    //longitude: number;
    //apType: string;
    apSource: string ;
    apAddress: string;
    apContact: string;
    apSubType: string;
    //apCountry: string;
    apState: string;
    elevation: number;
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
    //countryId: number;
}

export class Waypoint extends xpLocation {

    //locId: number;
    waypointId: number;
   //// latitude: number;
    longitude: number;
    //locType: number;
    //wpId: number;
   // code: string;
   // locName: string;
    wpState: string;
    wpTimezone: string;
    wpVariation: number;
    wpVariationDir: string;
    //wpType: number;
    //wpCountry: string;
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

