import {Component, OnInit, Input}  from '@angular/core';
import {AircraftService}   from '../../services/aircraft/aircraft.service';
import {AircraftSpeed, Aircraft} from '../models/aircraft.model';
import {AircraftDetailsComponent}   from './aircraft-detail.component';
import { Router} from '@angular/router';

@Component({
    selector: 'ac-speeds',
    templateUrl: 'acSpeeds.html'
})
export class AircraftSpeedsComponent implements OnInit{

    @Input() selectedAircraft: Aircraft;

    constructor() {
        console.log('creating Speeds Componenent');
    }

    ngOnInit() {
        console.log('ngOnInit Speeds Componenent');
    }    
}
