

import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, Inject}  from '@angular/core';
import {AircraftSpeedsComponent} from './aircraft-speeds.component';
import {AircraftWeightsComponent} from './aircraft-weights.component';
import {AircraftService}  from '../../services/aircraft/aircraft.service';
import { Router} from '@angular/router';
import {Aircraft, AircraftBrief} from '../models/aircraft.model';

@Component({
    selector: 'ac-list',
    templateUrl: 'aircraftList.html'
})
export class AircraftListComponent implements OnInit{

    _acList: AircraftBrief[];
    myListString: string;

    selectedAircraft: Aircraft;

    constructor(private _router: Router, public _acService: AircraftService) {
        console.log('creating List Component');
    };

    ngOnInit() {
        console.log('ngOnInit List Component');
        this._acService.aircraftDetailsChange$.subscribe(
            acDetails => {
                this.UpdateAircraft(acDetails);
            });
        this._acList = this._acService.getBriefAircraftList();
    }

    onSelect(ac: AircraftBrief) {
        this._acService.setCurrentAircraft(ac.id);
    }

    UpdateAircraft(theAircraft: Aircraft) {
        this.selectedAircraft = theAircraft;
    }
};
