//
// ===== File globals.ts    
//
'use strict';

export class XpGlobals {
    public version: string="0.0.3";  
}

export class BackEndUrl {
    //LOCAL
    // public static get SECURITY_API(): string  {return "http://localhost:51667/api/"};
    // public static get DATA_API(): string  {return "http://localhost:62389/api/"};
   //REMOTE
    public static get SECURITY_API(): string  {return "http://xp-security.azurewebsites.net/api/"};
    public static get DATA_API(): string  {return "http://flightx-webapi.azurewebsites.net/api/"};

}

export class XpLocationType {
    public static get LOCTYPE_AIRFIELD():number { return 1; } 
    public static get LOCTYPE_VFR_WAYPOINT():number { return 2; } 
    public static get LOCTYPE_IFR_WAYPOINT():number { return 3; } 
}

export class XpAirfieldCategory {
    public static get AIRFIELD_MARKER():number { return 1; }
    public static get HELIPAD_MARKER():number { return 2; }
    public static get SEAPORT_MARKER():number { return 3; }
    public static get WAYPOINT_VFR_MARKER():number { return 4; }
    public static get WAYPOINT_IFR_MARKER():number { return 5; } 
    public static get CLOSED_AIRFIELD_MARKER():number { return 6; } 
}

export class XpAirfieldTypes {
    public static get SMALL_AIRPORT():number { return 4; }
    public static get MEDIUM_AIRPORT():number { return 2; }
    public static get LARGE_AIRPORT():number { return 1; }
    public static get CLOSED():number { return 64; }
    public static get SEAPLANE_BASE():number { return 16; }
    public static get HELIPORT():number { return 8; }
    public static get BALLOONPORT():number { return 32; }
}
