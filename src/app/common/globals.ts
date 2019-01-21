export class XpLocationType {
    public static get LOCTYPE_AIRFIELD():number { return 1; } 
    public static get LOCTYPE_VFR_WAYPOINT():number { return 2; } 
    public static get LOCTYPE_IFR_WAYPOINT():number { return 3; } 
    public static get LOCTYPE_USER_DEFINED():number { return 4; } 
}


export class XpAirfieldTypes {
    public static get SMALL_AIRPORT():number { return 4; }
    public static get MEDIUM_AIRPORT():number { return 2; }
    public static get LARGE_AIRPORT():number { return 1; }
    public static get CLOSED():number { return 64; }
    public static get SEAPLANE_BASE():number { return 16; }
    public static get HELIPORT():number { return 8; }
    public static get BALLOONPORT():number { return 32; }
    public static get WAYPOINT_VFR():number { return 64; }
    public static get WAYPOINT_IFR():number { return 128; }
    public static get WAYPOINT_USER():number { return 256; }
}

export class DataLimits {
    public static  MAX_NUMBER_RECORD_RETURN = 10;
}