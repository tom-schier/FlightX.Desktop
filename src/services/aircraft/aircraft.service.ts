import { Injectable } from '@angular/core';
import { Aircraft } from '../../app/models/aircraft.model';
import { Subject } from 'rxjs';
import { aircraftList } from '../../data/mock-aircraft-data';
import { AircraftBrief } from '../../data/aircraft.types';

@Injectable({
  providedIn: 'root'
})
export class AircraftService {

  currentAircraft: Aircraft;

  // Observable string sources
  private obAircraftDetails = new Subject<Aircraft>();

  // Observable string streams
  aircraftDetailsChange$ = this.obAircraftDetails.asObservable();

  constructor() {
      console.log('Creating Aircraft service');
      this.currentAircraft = aircraftList.filter(x => x.id == 1)[0];
  }

  getBriefAircraftList() {
      var acList = [];
      for (var ac of aircraftList) {
          var acBrief = new AircraftBrief(ac.id, ac.name);
          acList.push(acBrief);
      }
      return acList;
  }

  getSelectedAircraft() {
      return this.currentAircraft;
  }
  getFirstAircraft() {
      var firstAc = aircraftList[0];
      return firstAc;
  }

  logError(err) {
      console.error('There was an error: ' + err);
  }

  getAircraftForId(id: number) {
     // this.selectedChange.next(aircraftList.filter(x => x.id == id)[0]);
      return aircraftList.filter(x => x.id == id)[0];
  }

  setCurrentAircraft(id: number) {
      this.currentAircraft = this.getAircraftForId(id);
      this.obAircraftDetails.next(this.currentAircraft);
  }
}


  