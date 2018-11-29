import { Injectable} from '@angular/core';
import { TrackModel } from '../../app/models/track.model';
import { XpLocation, xpTrackingPoint } from '../../app/models/airport.model';
import { Aircraft } from '../../app/models/aircraft.model';
import { WindDetails } from '../../app/models/weather.model';
import { BackEndUrl } from '../../app/models/globals.model';
import { Subject} from 'rxjs';
import { WeatherService } from '../weather/weather.service';


@Injectable({
    providedIn: 'root'
})
export class TrackService {

    public tracks: TrackModel[];
    public waypoints: xpTrackingPoint[];

    public totalDistance: number;
    public totalTime: number;
    public totalDistanceString: string;
    public totalTimeString: string;
    private selectedAircraft: Aircraft;
    public tst: string;
    private windRows: WindDetails[];

    // options: RequestOptions;
    headers = new Headers;

    private locServiceUrl = BackEndUrl.DATA_API + 'Locations/';

    // Observable string sources
    private obTrackDetails = new Subject<TrackModel[]>();
    private obWaypointDetails = new Subject<xpTrackingPoint[]>();
    private obTotalTime = new Subject<string>();
    private obTotalDistance = new Subject<string>();

    // Observable string streams
    trackDetailsChange$ = this.obTrackDetails.asObservable();
    waypointDetailsChange$ = this.obWaypointDetails.asObservable();
    totalTimeChanged$ = this.obTotalTime.asObservable();
    totalDistanceChanged$ = this.obTotalDistance.asObservable();

    constructor(private _weatherSvc: WeatherService) {
        console.log('creating flight planning service');
        this.tracks = new Array();
        this.waypoints = new Array();

        this._weatherSvc.windDetailsChange$.subscribe(
            msg => {
                this.updateTracks();
            });
        this.tst = "Tomas"
    }

    loadWinds() {
        this.windRows = this._weatherSvc.winds;
    }

    UpdateAircraft(theAircraft: Aircraft) {
        this.selectedAircraft = theAircraft;
    }

    AddLocation(aLoc: XpLocation, altitude: string) {
        if (aLoc == null)
            return;
        
        let tp = new xpTrackingPoint (aLoc);
        tp.altitude = altitude;
        this.waypoints.push(tp);
        this.obWaypointDetails.next(this.waypoints);

        this.updateTracks();
        this.obTrackDetails.next(this.tracks);
    }

    updateTracks() {
        let lastLoc: XpLocation;
        let idx = 0;
        this.totalDistance = 0;
        this.totalTime = 0;
        this.tracks = [];
        for (let aLoc of this.waypoints) {

            if (idx == 0) {

            }
            else {
                var newTrack = new TrackModel();
                newTrack.variation = -11.5;
                newTrack.headingMag
                newTrack.sector = idx;
                newTrack.fromLocation = lastLoc.code;
                newTrack.toLocation = aLoc.code;
                newTrack.altitude = aLoc.altitude;

                if (this.selectedAircraft != null)
                    newTrack.tas = this.selectedAircraft.acSpeeds.find(x => x.name == "TAS").val;


                let pos1 = new google.maps.LatLng(lastLoc.latitude, lastLoc.longitude, false);
                let pos2 = new google.maps.LatLng(aLoc.latitude, aLoc.longitude, false);

                newTrack.trackTrue = this.calculateTrack(pos2, pos1);

                newTrack.headingTrue = Math.round(this.calculateHeading(pos2, pos1, newTrack));
                newTrack.gs = Math.round(this.calculateGroundspeed(newTrack));

                let tmp = this.getDistance(pos1, pos2) * 0.000539957; //convert distance from m to nm
                newTrack.ti = ((tmp / newTrack.gs) * 60).toFixed(0);
                newTrack.distance = (this.getDistance(pos1, pos2) * 0.000539957).toFixed(0);
                this.totalDistance += (this.getDistance(pos1, pos2) * 0.000539957);
                this.totalTime += ((tmp / newTrack.gs) * 60);
                this.totalDistanceString = this.totalDistance.toFixed(0);
                this.totalTimeString = this.totalTime.toFixed(0);

                newTrack.headingMag = newTrack.headingTrue;
                this.tracks.push(newTrack);
            }
            lastLoc = aLoc;
            idx = idx + 1;
        }
        this.obTotalTime.next(this.totalTimeString);
        this.obTotalDistance.next(this.totalDistanceString);
    }

    rad(x: number) {
        return x * Math.PI / 180;
    };

    getDistance(p1: google.maps.LatLng, p2: google.maps.LatLng): number {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.lat() - p1.lat());
        var dLong = this.rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    };

    calculateTrack(p1: google.maps.LatLng, p2: google.maps.LatLng): number {
        let a1 = this._toRad(p1.lng());
        let a2 = this._toRad(p2.lng());
        let b1 = this._toRad(p1.lat());
        let b2 = this._toRad(p2.lat());

        let y = Math.sin(a2 - a1) * Math.cos(b2);
        let x = Math.cos(b1) * Math.sin(b2) -
            Math.sin(b1) * Math.cos(b2) * Math.cos(a2 - a1);
        let brng = this._toDeg(Math.atan2(y, x));

        if ((brng >= 0 && brng <= 90) || (brng >= 180 && brng <= 270) )
            brng = brng - 180;
        else
            brng = brng + 180;   
        if (brng < 0)
            brng = 360 + brng;                     
        return Math.round(brng);
    }

    calculateHeading(p1: google.maps.LatLng, p2: google.maps.LatLng, aTrack: TrackModel): number {

        let λ1 = this._toRad(p1.lng());
        let λ2 = this._toRad(p2.lng());
        let φ1 = this._toRad(p1.lat());
        let φ2 = this._toRad(p2.lat());

        let y = Math.sin(λ2 - λ1) * Math.cos(φ2);
        let x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
        let brng = this._toDeg(Math.atan2(y, x));
        //let tas = this.selectedAircraft.acSpeeds.find(x => x.name == "TAS").val;
        if (brng < 0)
            brng = 360 + brng;
        if (this._weatherSvc.winds.length > 0 && aTrack.altitude != "") {
            //find the wind altitude closest to the one for the track
            var windComponent = this._weatherSvc.FindBestWind(aTrack.altitude);
            if (windComponent == null) {
                return Math.round(brng);
            }
            else {
                // calculate the wind effect
                let wca = this.calculateWindCorrection(aTrack);
                return aTrack.trackTrue + wca;
            }
        }
        else {
            // no wind therfore no correction
            return Math.round(brng);
        }
    }

    calculateWindCorrection(aTrack: TrackModel) {

        if (this.selectedAircraft == null) {
            console.log("No aircraft specified for wind correction calculation");
            return 0;
        }
        let tas = this.selectedAircraft.acSpeeds.find(x => x.name == "TAS").val;
        var windComponent = this._weatherSvc.FindBestWind(aTrack.altitude);
        var wca: number;
        var tmp: number;
        var windDir: number;

        if (windComponent.direction > aTrack.trackTrue || windComponent.direction < (aTrack.trackTrue - 180)) {
            tmp = (aTrack.trackTrue + 180) - windComponent.direction;

        }
        else {
            tmp = (aTrack.trackTrue - windComponent.direction) - 180
        }

        if (Math.abs(tmp) >= 360) {
            wca = Math.abs(tmp) - 360;
        }
        else {
            wca = tmp;
        }

        // 2. Calculate the sin and cos for angle between track and wind
        let wcaSin = Math.sin(this._toRad(wca));
        let wcaCos = Math.cos(this._toRad(wca));

        return this._toDeg(Math.asin((windComponent.speed * wcaSin) / tas));
    }

    // Since not all browsers implement this we have our own utility that will
    // convert from degrees into radians

    _toRad(deg: number): number {
        return deg * Math.PI / 180;
    }

    //Since not all browsers implement this we have our own utility that will
    //convert from radians into degrees  
    _toDeg(rad: number): number {
        return rad * 180 / Math.PI;
    }

    calculateGroundspeed(aTrack: TrackModel): number {
        if (this.selectedAircraft == null) {
            console.log("No TAS available for GS calculations.");
            return 0;
        }
        //find the wind altitude closest to the one for the track
        if (this._weatherSvc.winds.length > 0) {
            let tas = this.selectedAircraft.acSpeeds.find(x => x.name == "TAS").val;

            var windComponent = this._weatherSvc.FindBestWind(aTrack.altitude);
            var wca: number;
            var tmp: number;
            var windDir: number;

            // if no wind is found return tas
            if (windComponent == null)
                return tas;

            if (windComponent.direction > aTrack.trackTrue || windComponent.direction < (aTrack.trackTrue - 180)) {
                tmp = (aTrack.trackTrue + 180) - windComponent.direction;

            }
            else {
                tmp = (aTrack.trackTrue - windComponent.direction) - 180
            }

            if (Math.abs(tmp) >= 360) {
                wca = Math.abs(tmp) - 360;
            }
            else {
                wca = tmp;
            }

            // 2. Calculate the sin and cos for angle between track and wind
            let wcaSin = Math.sin(this._toRad(wca));
            let wcaCos = Math.cos(this._toRad(wca));

            let xx = this._toDeg(Math.asin((windComponent.speed * wcaSin) / tas));
            return (tas * Math.cos(this._toRad(xx))) + (windComponent.speed * wcaCos)
        }
        else
            return this.selectedAircraft.acSpeeds.find(x => x.name == "TAS").val;
    }

    RemoveWaypoint(aLoc: xpTrackingPoint) {
        var idx = this.waypoints.indexOf(aLoc);
        this.waypoints.splice(idx, 1);
        this.obWaypointDetails.next(this.waypoints);

        this.updateTracks();
        this.obTrackDetails.next(this.tracks);
    }

    UpdateTrack(aTrack: TrackModel) {
        var idx = this.tracks.indexOf(aTrack);
        this.tracks[idx] = aTrack;
        this.obTrackDetails.next(this.tracks);
    }

    validLocation(ev: any): boolean {
        if (this.waypoints.length == 0)
            return true;
        let idx = this.waypoints.length;
        if (this.waypoints[idx-1]._id == ev.loc._id)
            return false;
        else    
            return true;
    }
}