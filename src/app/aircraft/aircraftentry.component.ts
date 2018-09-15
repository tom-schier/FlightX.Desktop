import { Component, OnInit } from '@angular/core';
import {AircraftService} from '../../services/aircraft/aircraft.service';
import { Aircraft } from '../models/aircraft.model';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'ac-entry',
    templateUrl: 'acEntry.html'
})
export class AircraftEntryComponent implements OnInit {

    _fb: FormBuilder;
   // model: TrackModel;
    stComments: string[];
    acForm: FormGroup;

    constructor(private _acService: AircraftService) { 
    }

    ngOnInit() {
                this.acForm = new FormGroup({
                    callSign: new FormControl('Callsign', [Validators.required]),
                    acType: new FormControl('acType', [Validators.required]),
                    descr: new FormControl('descr', [Validators.required]),
                    tasCrz: new FormControl('tasCrz', [Validators.required]),
                    tasClimb: new FormControl('tasClimb', [Validators.required]),
                    tasDesc: new FormControl('tasDesc', [Validators.required]),
                    fuelCrz: new FormControl('fuelCrz', [Validators.required]),
                    fuelClimb: new FormControl('fuelClimb', [Validators.required]),
                    fuelDesc: new FormControl('fuelDesc', [Validators.required]),
                    fuelGrnd: new FormControl('fuelDesc', [Validators.required]),                     
        });
    }

    onAdd() {
        this.stComments = [];
        if (this.acForm.controls["Callsign"].valid == false)
            this.stComments.push("Callsign type is a mandatory field.");
        if (this.acForm.controls["acType"].valid == false)
            this.stComments.push("Aircraft type is a mandatory field.");
        if (this.acForm.controls["descr"].valid == false)
            this.stComments.push("Description is a mandatory field.");

        let x = this.acForm.controls["callSign"].value;
        let y = this.acForm.controls["acType"].value;
        let z = this.acForm.controls["descr"].value;
        // if (isValid == false)
        //     return;
        //var newAc = new Aircraft(1, "deer", null, null);
        // newAc = model;
        // newAc.isReadOnly = true;
        // newAc.btnEditClass = this.stBtnEditDefaultClass;
        // newAc.btnRemoveClass = this.stBtnRemoveClass;

        // this._weatherService.AddWind(newWind);
    }
}