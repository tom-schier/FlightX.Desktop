import { Component, OnInit, Inject } from '@angular/core';
import { TrackModel } from '../models/track.model';
import { Aircraft } from '../models/aircraft.model';
import { XpLocation, xpTrackingPoint } from '../models/airport.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { WindDetails } from '../models/weather.model';
import { WeatherService } from '../../services/weather/weather.service';
import { AircraftService } from '../../services/aircraft/aircraft.service';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { TrackService } from '../../services/track/track.service';
import { iLocationService } from '../../interfaces/iLocationService';
import { debounceTime } from 'rxjs/operators';
import { XpLocationType } from '../models/globals.model';
import { CountryList } from 'src/data/mapping/countries';


export interface Altitude {
    value: number;
    viewValue: string;
  }

@Component({
  selector: 'track-data',
  templateUrl: './track-data.component.html',
  styleUrls: ['./track-data.component.css']
})
export class TrackDataComponent implements OnInit{

    aHeading: number;
    aDistance: string;
    aTas: number;
    model: TrackModel;
    tracks: TrackModel[];
    selWindspeed: number;
    selDirection: number;
    selAltitude: number;
    selIdx: number;
    selTrackComp: TrackModel;
    currAircraft: Aircraft;
    trackRows: TrackModel[];
    altList: string[];
    submitted = false;
    showList: boolean;
    errorMessage: string;
    stLocation: string;
    waypoints: XpLocation[];
    mode = 'Observable';
    displayValue: string;
    isSelected: boolean;
    hideNoResultsMsg: boolean;
    waypointRef: string;
    _fb: FormBuilder;
    trackForm: FormGroup;
    stComments: string[];
    selected: XpLocation;
    wnd: WindDetails;

    private stBtnEditDefaultClass: string;
    private stBtnEditSaveClass: string;
    private stBtnRemoveClass: string;
    searchTerm : FormControl = new FormControl();
    items: Array<XpLocation>;
    searchResult : XpLocation[];

    countries: CountryList;

    constructor(private _trackService: TrackService, private _weatherService: WeatherService, 
         private _acService: AircraftService, private fb: FormBuilder,  @Inject('iLocationService') private _locService: iLocationService)
        {
         
            this.model = new TrackModel();
            this.trackRows = new Array();
            this.countries = new CountryList();
            this.showList = false;
            this._fb = fb;
            this.trackForm = this._fb.group({
                loc: ['', [Validators.required, Validators.minLength(2)]],
                alt: ['', [Validators.required]]
              })

            this.stBtnEditDefaultClass = "btn btn-primary glyphicon glyphicon-pencil fa-lg";
            this.stBtnEditSaveClass = "btn btn-primary glyphicon glyphicon-ok fa-lg";
            this.stBtnRemoveClass = "btn btn-primary glyphicon glyphicon-remove fa-lg";

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
            this.isSelected = false;
            this.stLocation = "";
            this.selected = new XpLocation();
            this.tracks = this._trackService.tracks;
            this.waypoints = this._trackService.waypoints;

            this.hideNoResultsMsg = true;

        this.searchTerm.valueChanges
          .pipe(debounceTime(400))
          .subscribe(data => {
              if (data.length > 2) {
                this._locService.getLocationsBySearchString(data, 1).subscribe(response =>{
                    this.searchResult = response
                })
              }

          })

    }

    ngOnInit() {       

        this._trackService.trackDetailsChange$.subscribe(
            trackDetails => {
                this.UpdateTracks(trackDetails);
            });

        this._trackService.waypointDetailsChange$.subscribe(
            waypointDetails => {
                this.UpdateWaypoints(waypointDetails);
            });
        this._weatherService.windDetailsChange$.subscribe(
            windDetails => {
                this.UpdateWeather(windDetails);
            });
        this._acService.aircraftDetailsChange$.subscribe(
            acDetails => {
                this.UpdateAircraft(acDetails);
            });

        this.loadTracks();
        this.currAircraft = this._acService.currentAircraft;
    }


    autocompleListFormatter =  (data: any) => { 
        let st = this.countries.findCountry(data.locCountryCode);  
        let html =   `<img src="/assets/countries/${st}.png" class="flag" /><span>${data.locName}  ${data.code}</span>`;
        this.showList = true;
        return html;
    }

    valueFormatter(data: any): string {
        return data.locName;
    }
    
    observableSource = (keyword: any): Observable<XpLocation[]> => {
        if(keyword == null || keyword == "undefined" || keyword == undefined)
            return of([]);
        if (keyword.length < 3)
            return of([]);
        if (keyword) {
            this.showList = true;
            return this._locService.getLocationsBySearchString(keyword, 1);
        } else {
            return of([]);
        }
    }

    validateLocation(c: FormControl) {
        if (this.isSelected == true)
            return "All OK.";
        else
            return "Please select a location";
    }

    loadTracks() {
        this.trackRows = this._trackService.tracks;
    }

    onSelectLocation(event) {
        console.log("in onSelectLocation...")
        this.showList = false;        
        this.hideNoResultsMsg = true;
        //if (event instanceof XpLocation) {
            this.isSelected = true;
            this.selected = event
        //}
        // else {
        //     this.isSelected = false;
        // }
        
    }

    UpdateTracks(theTracks: TrackModel[]) {
        this.trackRows = theTracks;
    }

    UpdateWaypoints(theWaypoints: XpLocation[]) {
        if (theWaypoints.length == 0)
        {
            this.stComments = [];
           // this.stComments.push("No waypoints found for search criteria");
            return;
        }
        this.waypoints = theWaypoints;
    }

    UpdateAircraft(theAircraft: Aircraft) {
        this.currAircraft = theAircraft;
    }

    UpdateWeather(theWinds: WindDetails[]) {
        this.selWindspeed = theWinds[0].speed;
    }

    onSelect(item: XpLocation) {
        this.stLocation = item.locName;
        this.isSelected = true;
    }

    onSubmit(event) {
        this.submitted = true;
    }

    onAdd(model: any, isValid: boolean) {

        this.stComments = [];
        if (this.trackForm.controls["alt"].valid == false)
            this.stComments.push("Select valid altitude from list.");
        if (this.trackForm.controls["loc"].valid == false)
            this.stComments.push("Waypoint is invalid.");
        
        if (isValid == false)
            return;

        if (!this._trackService.validLocation(model)){
            this.stComments.push("Invalid location. CAnnot be the same as the last one");
            return;
        }
        this._locService.getLocationById(model.loc._id).subscribe(x => this._trackService.AddLocation(x, this.trackForm.controls["alt"].value));   
            
    }

    onRemove(aLoc: xpTrackingPoint) {
        this._trackService.RemoveWaypoint(aLoc);
    }

    onEdit(aTrack) {
        aTrack.btnEditClass = this.toggleClass(aTrack.btnEditClass, "btn btn-primary glyphicon glyphicon-pencil", "btn btn-primary glyphicon glyphicon-ok");
        aTrack.isReadOnly = (aTrack.btnEditClass == "btn btn-primary glyphicon glyphicon-pencil");
        if (aTrack.btnEditClass == "btn btn-primary glyphicon glyphicon-pencil")
            this._trackService.UpdateTrack(aTrack);
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
