import {Component, OnInit, Input}   from '@angular/core';
import {AircraftWeight, Aircraft}   from '../models/aircraft.model';
import {AircraftService}   from '../../services/aircraft/aircraft.service';
import {Router} from '@angular/router';

@Component({
    selector: 'ac-weights',
    templateUrl: 'acWeights.html'
})

export class AircraftWeightsComponent {

    @Input() selectedAircraft: Aircraft;

    constructor() {
        console.log('creating Weights Componenent');
    }

    ngOnInit() {
        console.log('ngOnInit Weights Componenent');
    }   
}

                                   