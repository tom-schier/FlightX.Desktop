import { Component, ElementRef, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather/weather.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { WindDetails } from '../models/weather.model';

@Component({
    selector: 'wind-data',
    templateUrl: 'windData.html',
    styles: ["./weather.component.css"]
})
export class WindDataComponent implements OnInit {

    windRows: WindDetails[];
    altList: string[];
    model: WindDetails;
    private stBtnEditDefaultClass: string;
    private stBtnEditSaveClass: string;
    private stBtnRemoveClass: string;
    windForm: FormGroup;
    active = true;
    stComments: string[];
    wnd: WindDetails;
    _fb: FormBuilder;

    // WeatherService will be injected from the parent component. This is because it is not listed
    // as a provider in the @Component decorator
    constructor(private fb: FormBuilder, public _weatherService: WeatherService, private _elRef: ElementRef) {
        this.wnd = new WindDetails();
        this.windRows = new Array();
        this.altList = new Array();
        this.stComments = new Array();
        this._fb = fb;

        this.windForm = this._fb.group({
            'speed': ['', [Validators.required, this.validateWindSpeed]],
            'direction': ['', [Validators.required, this.validateWindDirection]],
            'altitude': ['', [Validators.required]]
        })

        this.altList = new Array();
        this.altList.push('A010');
        this.altList.push('A020');
        this.altList.push('A030');
        this.altList.push('A040');
        this.altList.push('A050');
        this.altList.push('A060');
        this.altList.push('A070');
        this.altList.push('A080');
        this.altList.push('A090');
        this.altList.push('FL100');
    }

    ngOnInit() {
        this.model = new WindDetails();
        this._weatherService.windDetailsChange$.subscribe(
            wnd => {
                this.UpdateWinds(wnd);
            });
        this.loadWinds();
        this.subcribeToChanges();
    }

    loadWinds() {
        this.windRows = this._weatherService.winds;
    }

    UpdateWinds(theWinds: WindDetails[]) {
        this.loadWinds();
    }

    windAlreadyExists(model: WindDetails): boolean {
        if (this.windRows.length == 0) 
            return false;
        
        let idx = this.windRows.findIndex(x => x.altitude == model.altitude);
        return (idx > -1);
    }

    onAdd(model: WindDetails, isValid: boolean) {
        this.stComments = [];
        if (this.windForm.controls["altitude"].valid == false)
            this.stComments.push("Altitude is invalid. Select one from the list");
        if (this.windForm.controls["direction"].valid == false)
            this.stComments.push("Direction is invalid. Must be between a number between 0 and 360");
        if (this.windForm.controls["speed"].valid == false)
            this.stComments.push("Speed is invalid. Must be be a number between 1 and 300");

        if (this.windAlreadyExists(model) == true){
            this.stComments.push("There already is a wind entry for this flight level");
            return;
        }
            
        if (isValid == false)
            return;
        var newWind = new WindDetails();
        newWind = model;
        newWind.isReadOnly = true;
        newWind.btnEditClass = this.stBtnEditDefaultClass;
        newWind.btnRemoveClass = this.stBtnRemoveClass;

        this._weatherService.AddWind(newWind);
    }

    onRemove(aWind) {
        this._weatherService.RemoveWind(aWind);
    }

    subcribeToChanges() {
        // initialize stream
        const myFormValueChanges$ = this.windForm.valueChanges;
        // subscribe to the stream 
        myFormValueChanges$.subscribe(x => { this.stComments = []; });
    }

    validateWindSpeed(c: FormControl) {
        if (isNaN(c.value) == true)
            return "Speed must be between 1 amd 300";
        var speedNumber: number;
        speedNumber = +(c.value);
        if (speedNumber < 1 || speedNumber > 300)
            return "Speed must be between 1 amd 300";
    }

    validateWindDirection(c: FormControl) {
        if (isNaN(c.value) == true)
            return "Direction must be between 0 amd 360";
        var dirNumber: number;
        dirNumber = +(c.value);
        if (dirNumber < 0 || dirNumber > 360)
            return "Direction must be between 0 amd 360";
    }


    toggleClass(c0: string, c1: string, c2: string) {
        if (c0 == c1)
            return c2;
        if (c0 == c2)
            return c1;
        else
            return c0;
    }

}
