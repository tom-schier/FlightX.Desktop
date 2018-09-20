import { Component, OnInit, Inject } from '@angular/core';
import { TrackModel } from '../models/track.model';
import { Aircraft } from '../models/aircraft.model';
import { xpLocation, xpTrackingPoint } from '../models/airport.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { WindDetails } from '../models/weather.model';
import { WeatherService } from '../../services/weather/weather.service';
import { AircraftService } from '../../services/aircraft/aircraft.service';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { TrackService } from '../../services/track/track.service';
import { iLocationService } from '../../interfaces/iLocationService';
import { debounceTime } from 'rxjs/operators';


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
    //loc: xpLocation;
    waypoints: xpLocation[];
    mode = 'Observable';
    displayValue: string;
    isSelected: boolean;
    hideNoResultsMsg: boolean;
    waypointRef: string;
    _fb: FormBuilder;
    trackForm: FormGroup;
    stComments: string[];
    selected: xpLocation;
    wnd: WindDetails;

    private stBtnEditDefaultClass: string;
    private stBtnEditSaveClass: string;
    private stBtnRemoveClass: string;
    searchTerm : FormControl = new FormControl();
    //items: Array<Airport>;
    items: Array<xpLocation>;
    searchResult : xpLocation[];

    constructor(private _trackService: TrackService, private _weatherService: WeatherService, 
         private _acService: AircraftService, private fb: FormBuilder,  @Inject('iLocationService') private _locService: iLocationService)
        {
         
            this.model = new TrackModel();
            this.trackRows = new Array();
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
            this.selected = new xpLocation();
            this.tracks = this._trackService.tracks;
            this.waypoints = this._trackService.waypoints;

            this.hideNoResultsMsg = true;

        this.searchTerm.valueChanges
          .pipe(debounceTime(400))
          .subscribe(data => {
              if (data.length > 2) {
                this._locService.getAirportLocationsBySearchString(data).subscribe(response =>{
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


    autocompleListFormatter (data: any) {
        let html =   `<img src="/assets/countries/${data.locCountry}.png" class="flag" /><span>${data.locName}  ${data.code}</span>`;
        this.showList = true;
        return html;
    }

    valueFormatter(data: any): string {
        this.trackForm.controls['loc'].setValue(this.selected);
        this.showList = false;
        this.isSelected = true;
        this.hideNoResultsMsg = true; 
        return data.locName;
    }
    
    observableSource = (keyword: any): Observable<any[]> => {
        if(keyword == null || keyword == "undefined" || keyword == undefined)
            return of([]);
        if (keyword.length < 3)
            return of([]);
        if (keyword) {
            this.showList = true;
            return this._locService.getAirportLocationsBySearchString(keyword);
        } else {
            return of([]);
        }
    }

    // observableSource = (keyword: any): Observable<xpLocation[]> => {

    //     return this._trackService.getAirportLocationsBySearchString(keyword);
    // }
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
       // this.trackForm.controls['waypoint'].setValue(this.selected.locName);
        this.showList = false;
        this.isSelected = true;
        this.hideNoResultsMsg = true;
    }

    UpdateTracks(theTracks: TrackModel[]) {
        this.trackRows = theTracks;
    }

    UpdateWaypoints(theWaypoints: xpLocation[]) {
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

    onSelect(item: xpLocation) {
        this.stLocation = item.locName;
        this.isSelected = true;
    }

    onSubmit(event) {
        this.submitted = true;
    }
    active = true;

    onAdd(model: any, isValid: boolean) {

        this.stComments = [];
        if (this.trackForm.controls["alt"].valid == false)
            this.stComments.push("Select valid altitude from list.");
        if (this.trackForm.controls["loc"].valid == false)
            this.stComments.push("Waypoint is invalid.");
        
        if (isValid == false)
            return;

        this._locService.getAirportByLocationID(model.loc.locId).subscribe(x => this._trackService.AddLocation(x, this.trackForm.controls["alt"].value));     
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

// export class TrackDataComponent implements OnInit{

//   aHeading: number;
//   aDistance: string;
//   aTas: number;
//   model: TrackModel;
//   tracks: TrackModel[];
//   selWindspeed: number;
//   selDirection: number;
//   selAltitude: number;
//   selIdx: number;
//   selTrackComp: TrackModel;
//   currAircraft: Aircraft;
//   trackRows: TrackModel[];
//   altList: Altitude[];
//   submitted = false;
//   showList: boolean;
//   errorMessage: string;
//   stLocation: string;
//   //loc: xpLocation;
//   waypoints: xpLocation[];
//   mode = 'Observable';
//   displayValue: string;
//   isSelected: boolean;
//   hideNoResultsMsg: boolean;
//   waypointRef: string;
//   _fb: FormBuilder;
//   trackForm: FormGroup;
//   locations: FormGroup;
//   altitudes: FormGroup;
//   stComments: string[];
//   selected: xpLocation;
//   wnd: WindDetails;
//   searchTerm : FormControl = new FormControl();
//   locList : FormControl = new FormControl();
//   searchResult : xpLocation[];

//   private stBtnEditDefaultClass: string;
//   private stBtnEditSaveClass: string;
//   private stBtnRemoveClass: string;
//   //items: Array<Airport>;
//   items: Array<xpLocation>;

//   constructor(public _trackService: TrackService, private _weatherService: WeatherService, @Inject('iLocationService') private _locService: iLocationService,
//        private _acService: AircraftService, private fb: FormBuilder, private _sanitizer: DomSanitizer)
//       {
       
//           this.model = new TrackModel();
//           this.trackRows = new Array();
//           this.showList = false;
//           this._fb = fb;
//           this.trackForm = new FormGroup({
//                 loc: new FormGroup({ searchTerm: this.searchTerm, locList: this.locList },[Validators.required, Validators.minLength(2)]),
//                 alt: new FormGroup({ altitude: new FormControl()},[Validators.required])
//           });
//         //   this.trackForm = this._fb.group({

//         //     'waypoint': ['', [Validators.required, Validators.minLength(2)]],
//         //     'altitude': ['', [Validators.required]]
//         // });


//           this.stBtnEditDefaultClass = "btn btn-primary glyphicon glyphicon-pencil fa-lg";
//           this.stBtnEditSaveClass = "btn btn-primary glyphicon glyphicon-ok fa-lg";
//           this.stBtnRemoveClass = "btn btn-primary glyphicon glyphicon-remove fa-lg";
//         this.altList = [
//             {value: 1, viewValue: "A020"},
//             {value: 2, viewValue: "A030"},
//             {value: 3, viewValue: "A040"},
//             {value: 4, viewValue: "A050"},
//             {value: 5, viewValue: "A060"},
//             {value: 6, viewValue: "A070"},
//             {value: 7, viewValue: "A080"},
//             {value: 8, viewValue: "A090"}
//         ]
//           this.isSelected = false;
//           this.stLocation = "";
//           this.selected = new xpLocation();
//           this.tracks = this._trackService.tracks;
//           this.waypoints = this._trackService.waypoints;

//           this.hideNoResultsMsg = true;
//   }

//   ngOnInit() {       

//       this._trackService.trackDetailsChange$.subscribe(
//           trackDetails => {
//               this.UpdateTracks(trackDetails);
//           });

//       this._trackService.waypointDetailsChange$.subscribe(
//           waypointDetails => {
//               this.UpdateWaypoints(waypointDetails);
//           });
//       this._weatherService.windDetailsChange$.subscribe(
//           windDetails => {
//               this.UpdateWeather(windDetails);
//           });
//       this._acService.aircraftDetailsChange$.subscribe(
//           acDetails => {
//               this.UpdateAircraft(acDetails);
//           });
    
//           this.searchTerm.valueChanges
//           .pipe(debounceTime(400))
//           .subscribe(data => {
//               this._locService.getAirportLocationsBySearchString(data).subscribe(response =>{
//                   this.searchResult = response
//               })
//           })


//       this.loadTracks();
//       this.currAircraft = this._acService.currentAircraft;
//   }


//   autocompleListFormatter = (data: any) : SafeHtml => {
//       let html =   `<img src="/public/countries/${data.apCountry}.png" class="flag" /><span>${data.locName}  ${data.code}</span>`;
//       this.showList = true;
//       return this._sanitizer.bypassSecurityTrustHtml(html);
//   }

// //   autocompleListFormatter(data: any): string {
// //     let html =   `<img src="/public/countries/${data.apCountry}.png" class="flag" /><span>${data.locName}  ${data.code}</span>`;
// //     this.showList = true;
// //     return html;
// //   }

//   valueFormatter(data: any): string {
//       this.trackForm.controls['waypoint'].setValue(this.selected);
//       this.showList = false;
//       this.isSelected = true;
//       this.hideNoResultsMsg = true; 
//       return data.locName;
//   }

// //   valueFormatter(data: any): string {
// //     return `(${data[0]}) ${data[1]}`;
// //   }
  

//   search_word(term){
//     // return this._locService.getAirportLocationsBySearchString(term).map(res => {
//     //     return res.json().map(item => {
//     //         return item.locName
//     //     })
//     // });
//     // return this.http.get(this.url + term).map(res => {
//     //     return res.json().map(item => {
//     //         return item.word
//     //     })
//     // })
// }
//   public observableSource = (keyword: any): Observable<any[]> => {
//       if(keyword == null || keyword == "undefined" || keyword == undefined)
//           return of([]);
//       if (keyword.length < 3)
//           return of([]);
//       if (keyword) {
//           this.showList = true;
//           return this._locService.getAirportLocationsBySearchString(keyword);
//       } else {
//           return of([]);
//       }
//   }

//   // observableSource = (keyword: any): Observable<xpLocation[]> => {

//   //     return this._trackService.getAirportLocationsBySearchString(keyword);
//   // }
//   validateLocation(c: FormControl) {
//       if (this.isSelected == true)
//           return "All OK.";
//       else
//           return "Please select a location";
//   }


//   loadTracks() {
//       this.trackRows = this._trackService.tracks;
//   }

//   onSelectLocation(event) {
//       console.log("in onSelectLocation...")
//       this.trackForm.controls['searchTerm'].setValue(this.selected.locName);
//       this.showList = false;
//       this.isSelected = true;
//       this.hideNoResultsMsg = true;
//   }

//   UpdateTracks(theTracks: TrackModel[]) {
//       this.trackRows = theTracks;
//   }

//   UpdateWaypoints(theWaypoints: xpLocation[]) {
//       if (theWaypoints.length == 0)
//       {
//           this.stComments = [];
//          // this.stComments.push("No waypoints found for search criteria");
//           return;
//       }
//       this.waypoints = theWaypoints;
//   }

//   UpdateAircraft(theAircraft: Aircraft) {
//       this.currAircraft = theAircraft;
//   }

//   UpdateWeather(theWinds: WindDetails[]) {
//       this.selWindspeed = theWinds[0].speed;
//   }

//   onSelect(item: xpLocation) {
//       this.selected = item;
//       this.stLocation = item.locName;
//       this.isSelected = true;
//   }

//   onSubmit(event) {
//       this.submitted = true;
//   }



//   onAdd(model: TrackModel, isValid: boolean) {

//       this.stComments = [];
//       if (this.trackForm.controls["altitude"].valid == false)
//           this.stComments.push("Select valid altitude from list.");
//       if (this.trackForm.controls["waypoint"].valid == false)
//           this.stComments.push("Waypoint is invalid.");
      
//       if (isValid == false)
//           return;

//       this._trackService.getLocationByDescr(this.trackForm.controls["waypoint"].value).subscribe(x => this._trackService.AddLocation(x, this.trackForm.controls["altitude"].value));     
//   }


//   onRemove(aLoc: xpLocation) {
//       this._trackService.RemoveWaypoint(aLoc);
//   }

//   onEdit(aTrack) {
//       aTrack.btnEditClass = this.toggleClass(aTrack.btnEditClass, "btn btn-primary glyphicon glyphicon-pencil", "btn btn-primary glyphicon glyphicon-ok");
//       aTrack.isReadOnly = (aTrack.btnEditClass == "btn btn-primary glyphicon glyphicon-pencil");
//       if (aTrack.btnEditClass == "btn btn-primary glyphicon glyphicon-pencil")
//           this._trackService.UpdateTrack(aTrack);
//   }

//   toggleClass(c0: string, c1: string, c2: string) {
//       if (c0 == c1)
//           return c2;
//       if (c0 == c2)
//           return c1;
//       else
//           return c0;
//   }
// }

