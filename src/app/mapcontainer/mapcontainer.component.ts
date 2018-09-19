


import { Component, OnInit, Input, ViewChild, Inject, AfterViewInit } from '@angular/core';
//  import { Injectable } from '@angular/core';
//  import {TrackModel} from '../common/track'
import { TrackService } from '../../services/track/track.service';
//  import { Observable }     from 'rxjs/Observable';
//  import { Subject }    from 'rxjs/Subject';
import { Airport, xpLocation } from '../models/airport.model';
import { XpAirfieldCategory, XpLocationType, XpAirfieldTypes } from '../models/globals.model'

declare var map: any;
declare var geocoder: any;
declare var google: any;


@Component({
  selector: 'map-container',
  templateUrl: './mapcontainer.component.html',
  styles: ["./mapcontainer.component.css"]
}
)
export class MapcontainerComponent implements OnInit, AfterViewInit {
  address: string;
  // the markers array will contain a list of Google marker objects
  markers: Array<google.maps.Marker>;
  nearFields: Array<google.maps.Marker>;
  lines: Array<google.maps.Polyline>;
  intialPosition: google.maps.LatLng;
  lat: number = -33.8688;
  lng: number = 151.2093;
  initialZoom: number = 9;
  deleteMe: number = 666;
  geocoder: google.maps.Geocoder;
  theMap: google.maps.Map;
  flightPath: google.maps.Polyline;
  mapupdater: number;
  that: any;
  airfieldsNearby: Airport[];
  errorMessage: string;
  hideSearchMessage: boolean;
  @ViewChild("map") mapElement: any;

  constructor(private _trackService: TrackService) {
    this.markers = new Array<google.maps.Marker>();
    this.nearFields = new Array<google.maps.Marker>();
    this.lines = new Array<google.maps.Polyline>();
    this.geocoder = new google.maps.Geocoder();
    this.address = "27 Croft Rd, Eleebana, NSW, Australia";
    this.that = this;
    this.hideSearchMessage = true;
    this.intialPosition = new google.maps.LatLng(this.lat, this.lng);
  }

  onSetToCurrent() {
    var infoWindow = new google.maps.InfoWindow({ map: this.theMap });
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        this.theMap.setCenter(pos);
      }, () => {
        this.handleLocationError(true, infoWindow, this.theMap.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, infoWindow, this.theMap.getCenter());
    }
  }



  ngAfterViewInit() {
    console.log('After Init MapContainer');
   this.initMap();
   this.UpdateMap();
  }

  ngOnInit() {
    console.log('Initialising MapContainer');

    this.theMap = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: this.initialZoom,
      center: { lat: this.lat, lng: this.lng }
    });

    //check if there are any entries in the flight plan
    if (this._trackService.waypoints.length > 0) {
      let apLocation = this._trackService.waypoints[this._trackService.waypoints.length - 1];
      if (!apLocation) {
        console.log('Blank location found in array.');
        return;
      }
      let pos = new google.maps.LatLng({
        lat: apLocation.latitude,
        lng: apLocation.longitude
      });
      this.theMap.setCenter(pos);
    }
    else {
      var infoWindow = new google.maps.InfoWindow({ map: this.theMap });
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          let pos = new google.maps.LatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });

          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found.');
          this.theMap.setCenter(pos);
          this.addMarker(pos);
        }, () => {
          this.handleLocationError(true, infoWindow, this.theMap.getCenter());
          this.theMap.setCenter(this.intialPosition);
          this.addMarker(this.intialPosition);
        });
      } else {
        // Browser doesn't support Geolocation
        this.handleLocationError(false, infoWindow, this.theMap.getCenter());
      }
    }

    this._trackService.waypointDetailsChange$.subscribe(
      trackDetails => {
        this.UpdateMap();
      });
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }


  private initMap() {

    this.theMap.addListener('click', () => {
      console.log("Map has been clicked")
    });

    this.hideSearchMessage = true;
    // this.theMap.addListener('bounds_changed', () => {
    //             clearTimeout(this.mapupdater);
    //             this.mapupdater = setTimeout(() => {
    //                 this.onBoundsChanged(this.theMap);
    //             }, 500);                   
    // });

    this._trackService.waypointDetailsChange$.subscribe(
      trackDetails => {
        this.UpdateMap();
      });
  }

  // onFindClick(event) {
  //     console.log('onFindClick');
  //     this.hideSearchMessage = false;
  //     var bounds = this.theMap.getBounds();
  //     this._locService.getAirportsNearBy(bounds).subscribe(
  //        apData => this.setMarkersForAirports(apData),
  //        error =>  this.errorMessage = <any>error);

  //     console.log("Found airfields");      
  // }

  addLocationToMap(ap: xpLocation) : google.maps.Marker {
    if (ap == null)
      return;

  var markerTypeBase = "/assets/images/";
    let infowindow = new google.maps.InfoWindow({
      content: ap.code + " : " + ap.locName
    });
    var theIcon;
    theIcon = {
      url: markerTypeBase + "airport.png", // url
      size: new google.maps.Size(25, 25), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0), // anchor
      scaledSize: new google.maps.Size(15, 15),
      title: ap.locName
    }
    let locLatLng: google.maps.LatLng;
    if (ap.locType == XpAirfieldTypes.HELIPORT) {
      theIcon = {
        url: markerTypeBase + "heliport.png", // url
        size: new google.maps.Size(25, 25), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0), // anchor
        scaledSize: new google.maps.Size(15, 15),
        title: ap.locName
      }
    }
    if (ap.locType == XpAirfieldTypes.SEAPLANE_BASE) {
      theIcon = {
        url: markerTypeBase + "seaplane.png", // url
        size: new google.maps.Size(25, 25), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(15, 15),
        title: ap.locName // anchor
      }
    }

    locLatLng = new google.maps.LatLng(ap.latitude, ap.longitude, false);
    var marker = new google.maps.Marker({
      position: locLatLng,
      icon: theIcon,
      map: this.theMap
    });
    google.maps.event.addListener(marker, 'mouseover', function () {
      infowindow.open(map, this);
    });

    google.maps.event.addListener(marker, 'mouseout', function () {
      infowindow.close();
    });

    google.maps.event.addListener(marker, 'rightclick', (mouseEvent) => {
      alert("right clicked marker");
    });
    this.nearFields.push(marker);
    this.markers.push(marker);
    this.lat = ap.latitude;
    this.lng = ap.longitude;

    if (this.markers.length > 1) {
      this.drawLine(this.markers[this.markers.length - 1], this.markers[this.markers.length - 2]);
    }
    this.theMap.setCenter(locLatLng);
    return marker;
  }

  setMarkersForAirports(apData: Airport[]) {
    if (apData == null)
      return;
    var cnt = apData.length;
    var markerTypeBase = "/public/images/";
    for (let i = 0; i < cnt; i++) {
      let aa = apData[i];
      let marker = this.addLocationToMap(apData[i]);
      google.maps.event.addListener(marker, 'click', () => {
         this._trackService.AddLocation(aa, "AO50");
      });

    }
    this.hideSearchMessage = true;
  }


  onClearClick(event) {
    console.log('onClearClick');
    this.hideSearchMessage = true;
    for (var i = 0; i < this.nearFields.length; i++) {
      // by calling the setMap function on the Google marker object the marker will be placed on the map
      // if map == null the marker will be removed if it exists on the map
      this.nearFields[i].setMap(null);
    }
    this.nearFields = [];
  }

  UpdateMap() {
    if (this.theMap == null)
      return;
    this.clearMarkers();
    let centreLoc: google.maps.LatLng;
    for (let aLoc of this._trackService.waypoints) {
      this.addLocationToMap(aLoc)
    }

    //this.theMap.setCenter(centreLoc);
    this.showMarkers();
  }

  convertCoordStringToNumber(coordinates: string, dir: string): number {
    let values = coordinates.split(' ');

    let major = values[0];
    let minor = values[1];
    let minorNumber = (parseFloat(minor) / 60);
    let majorNumber = parseFloat(major);
    let incr = values[2];
    let newCoordinate = majorNumber + minorNumber;
    if (dir == 'W' || dir == 'S')
      return newCoordinate * (-1);
    else
      return newCoordinate;
  }

  onBoundsChanged(aMap: google.maps.Map) {
    console.log("in onBoundsChanged");
  }

  setMarkerForAddress() {
    // calls the geocode method in the Google API, specifies setMarker as the event handler
    this.geocoder.geocode({ 'address': this.address }, this.setMarker);
  }

  // note the syntax how this function is declared. This will ensure the event listener for geocode will work
  // see above the call to this.setMarker can be resolved using this syntax below
  // good information regarding this can be fount here https://github.com/Microsoft/TypeScript/wiki/ 
  private setMarker = (results, status) => {
    if (status === 'OK') {
      this.lat = results[0].geometry.location.lat();
      this.clearMarkers();
      this.theMap.setCenter(results[0].geometry.location);
      this.addMarker(results[0].geometry.location);
    }
  }

  // Adds a marker to the map and push to the array. The parameter is expected to be a 
  private addMarker = (location: google.maps.LatLng) => {
    var marker = new google.maps.Marker({
      position: location,
      map: this.theMap
    });
    this.markers.push(marker);
    this.lat = location.lat();
    this.lng = location.lng();

    if (this.markers.length > 1) {
      this.drawLine(this.markers[this.markers.length - 1], this.markers[this.markers.length - 2]);
    }

  }

  // Sets the map on all markers in the array.
  private setMapOnAll() {
    for (var i = 0; i < this.markers.length; i++) {
      // by calling the setMap function on the Google marker object the marker will be placed on the map
      // if map == null the marker will be removed if it exists on the map
      this.markers[i].setMap(this.theMap);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  private clearMarkers() {
    // this.setMapOnAll(null);

    for (var i = 0; i < this.markers.length; i++) {
      // by calling the setMap function on the Google marker object the marker will be placed on the map
      // if map == null the marker will be removed if it exists on the map
      this.markers[i].setMap(null);
    }
    for (var i = 0; i < this.lines.length; i++) {
      // by calling the setMap function on the Google marker object the marker will be placed on the map
      // if map == null the marker will be removed if it exists on the map
      this.lines[i].setMap(null);
    }
    this.lines = [];
    this.markers = [];
  }

  // Shows any markers currently in the array.
  private showMarkers() {
    this.setMapOnAll();
  }

  // Deletes all markers in the array by removing references to them.
  private deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  public drawLine(point1: google.maps.Marker, point2: google.maps.Marker) {
    var line = new google.maps.Polyline({
      path: [
        point1.getPosition(),
        point2.getPosition()
      ],
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      geodesic: true,
      map: this.theMap
    });
    this.lines.push(line);
  }

}
