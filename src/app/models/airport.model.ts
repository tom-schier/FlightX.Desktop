export class XpLocation {
    _id: any;
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
    apCountry: string;
}

export class xpTrackingPoint extends XpLocation  {

    altitude: string;

    constructor(aLoc: XpLocation){
        super();
        this.locId = aLoc.locId;
        this.locType = aLoc.locType;
        this.latitude = aLoc.latitude;
        this.longitude = aLoc.longitude;
        this.code = aLoc.code;
        this.locCountryCode = aLoc.locCountryCode;
        this.locName = aLoc.locName;
        this.elevation = aLoc.elevation;
    }
}
export class XpAirfieldTypes {
    static SMALL_AIRPORT: number = 4;
    static MEDIUM_AIRPORT: number = 2;
    static LARGE_AIRPORT: number = 1;
    static CLOSED: number = 64;
    static SEAPLANE_BASE: number = 16;
    static HELIPORT: number = 8;
    static BALLOONPORT: number = 32;
}

