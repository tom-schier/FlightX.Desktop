


 import {TrackService}   from '../../services/track/track.service';
 import {WindDetails}  from '../models/weather.model';
 import {WeatherService, }  from '../../services/weather/weather.service';
 import {Component, OnInit, Input, Output, EventEmitter}  from '@angular/core';
 import {AircraftService}  from '../../services/aircraft/aircraft.service';
 import { Router} from '@angular/router';
 import {Aircraft, AircraftBrief} from '../models/aircraft.model';
import { TrackModel } from '../models/track.model';
 
 
 @Component({
     templateUrl: 'flightpath.component.html'
 })
 export class FlightpathComponent implements OnInit {

    selectedAircraft: Aircraft;
    acFlightPlanSpeed: number;
    windDirection: number;
    windSpeed: number;
    totalDistance: string;
    totalTime: string;

    constructor(private _acService: AircraftService,
                public _weatherService: WeatherService, public _trackService: TrackService) {
        console.log('Creating FlightPath Component');
    }

    ngOnInit() {
        console.log('ngOnInit FlightPath Component');
        this.selectedAircraft = this._acService.getSelectedAircraft();
        this._trackService.UpdateAircraft(this.selectedAircraft);
        this._acService.aircraftDetailsChange$.subscribe(
            acDetails => {
                this.UpdateAircraft(acDetails);
            });

        this._weatherService.windDetailsChange$.subscribe(
            wnd => {
                this.CalculateWindEffect(wnd);
            });

        this._trackService.trackDetailsChange$.subscribe(
            tr => {
                this.CalculateTrackChanges(tr);
            });

        this._trackService.totalDistanceChanged$.subscribe(td => {
            this.totalDistance = td;
        });

        this._trackService.totalTimeChanged$.subscribe(ti => {
            this.totalTime = ti;
        });

        this.totalTime = this._trackService.totalTimeString;
        this.totalDistance = this._trackService.totalDistanceString;
    }

    UpdateAircraft(theAircraft: Aircraft) {
        if (theAircraft == null)
            return;
        this.selectedAircraft = theAircraft;
        this.acFlightPlanSpeed = theAircraft.acSpeeds.find(x => x.name == "TAS").val;
        this._trackService.UpdateAircraft(theAircraft);
        this._trackService.updateTracks();
    }

    CalculateWindEffect(winds: WindDetails[]) {
        // update the calcTrack array
    }

    CalculateTrackChanges(tracks: TrackModel[]) {
        // empty the calcTrack array, recreate and take winds into account
    }

    findClosestWind(aTrack: TrackModel) {
        // return a WindDetails object
    }

}