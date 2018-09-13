// import {Component, Input, OnInit, EventEmitter, Output, ViewEncapsulation, AfterViewInit}   from '@angular/core';
// import {provideRoutes, Router} from '@angular/router';
// import {AircraftListComponent}           from './aircraft/aircraftlist.component';
// import {FlightPathComponent}   from './planning/flightpath.component';
// import {MapContainer}   from './planning/mapcontainer.component';
// import {AircraftDetailsComponent} from './aircraft/aircraft-detail.component';
// import {AircraftService}           from './services/aircraft.service';
// import {TrackService}   from './services/track.service';
// import {WeatherService, WindDetails} from './services/weather.service';
// import {Aircraft}           from './data/aircraft.types';
// import { CollapseDirective } from 'ng2-bootstrap'
// import { LoginComponent } from './login/login.component';
// import { AlertService } from './login/alert.service'

// import '../../public/css/styles.css';
// import '../../public/css/simple-sidebar.css';
// import '../../lib/bootstrap/dist/css/bootstrap.css';
// import '../../lib/font-awesome-4.6.3/css/font-awesome.css';

// import { UserAccountProvider} from './user-account/user-account.service'

// @Component({
//     selector: 'app-root',
//     templateUrl: 'flightplanner.html',
//     providers: [AircraftService]
// })
// export class FlightPlanner implements OnInit, AfterViewInit{

//     id: number;
//     public isCollapsed:boolean = true;
//     showMenu: boolean = false;

//     constructor(private _acService: AircraftService, private _trackService: TrackService,
//         private _weatherService: WeatherService, private _userAccSvc: UserAccountProvider) {
//         console.log('creating AppComponent'); 
//     }
      
 
//     public collapsed(event:any):void {
//         console.log(event);
//     }

//     public expanded(event:any):void {
//         console.log(event);
//     }
    
//     ngOnInit() {
//         console.log('ngOnInit AppComponent');   
//         this._acService.aircraftDetailsChange$.subscribe(
//             msg => {
//                 this.updateMessage(msg);
//             });  
//         this._userAccSvc.logStatusChanged$.subscribe(status => {
//             this.showMenu = status;
//         })
//         this.showMenu = this._userAccSvc.isLoggedIn();
//     }

//     ngAfterViewInit() {

//         // add some sample data
//         this._trackService.waypoints = [];
        
//         let wind3 = new WindDetails();
//         wind3.id = 1;
//         wind3.altitude = 'A020';
//         wind3.direction = 205;
//         wind3.speed = 12;
//         this._weatherService.AddWind(wind3);   

//         let wind2 = new WindDetails();
//         wind2.id = 2;
//         wind2.altitude = 'A030';
//         wind2.direction = 220;
//         wind2.speed = 18;
//         this._weatherService.AddWind(wind2); 

//         let wind1 = new WindDetails();
//         wind1.id = 1;
//         wind1.altitude = 'A050';
//         wind1.direction = 270;
//         wind1.speed = 25;
//         this._weatherService.AddWind(wind1);  
                                                                                 
//     }

//     updateMessage(msg: Aircraft) {
//         this.id = msg.id;
//     }

//     getAircraftDetails(evt) {       
//     }
// }