"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aircraft_types_1 = require("./aircraft.types");
/*** description constants for speeds ************/
var vfeDescription = 'Maximum flap extension speed';
var tasDescription = 'Standard airspeeed used for flight planning';
var vneDescription = 'Never Exceeed Speed';
var psdDescription = 'Maximum parachute deployment speed';
var tasDescription = 'Airspeed used for flight planning';
var vxDescription = 'Best angle of climbe speed';
var vyDescription = 'Best rate of climb speed';
var vrDescription = 'Rotation speed';
var vsoDescription = 'Stall speed in landing configuraton';
var vsDescription = 'Stall speed with no flap';
var vaDescription = 'Maneouvering speed';
var vnoDescription = 'Max normal operating speed';
/***** description constants for weights *********/
var mtowDescription = 'Maximum take-off weight';
var mlwDescription = 'The maximum landing weight';
var bewDescription = 'The basic empty weight';
var payloadDescription = 'The maximum payload with full fuel';
var baggageDescription = 'Maxmum weight in thr baggage compartment';
var aircraftSpeedsCessna172 = [
    new aircraft_types_1.AircraftSpeed(1, 'VFE', 90, vfeDescription),
    new aircraft_types_1.AircraftSpeed(2, 'TAS', 110, tasDescription),
    new aircraft_types_1.AircraftSpeed(3, 'VNE', 155, vneDescription),
    new aircraft_types_1.AircraftSpeed(4, 'VX', 65, vxDescription),
    new aircraft_types_1.AircraftSpeed(5, 'VY', 75, vyDescription),
    new aircraft_types_1.AircraftSpeed(7, 'VSO', 44, vsoDescription),
    new aircraft_types_1.AircraftSpeed(8, 'VS', 52, vsDescription),
    new aircraft_types_1.AircraftSpeed(9, 'VA', 125, vaDescription),
    new aircraft_types_1.AircraftSpeed(10, 'VR', 60, vrDescription),
];
var aircraftWeightsCessna172 = [
    new aircraft_types_1.AircraftWeight(1, 'MTOW', 1092, 'Maximum take-off weight'),
    new aircraft_types_1.AircraftWeight(2, 'BEW', 684, 'The basic empty weight'),
    new aircraft_types_1.AircraftWeight(3, 'MLW', 1092, mlwDescription),
    new aircraft_types_1.AircraftWeight(4, 'Max Payload', 305, payloadDescription),
];
var aircraftSpeedsCirrusSR20 = [
    new aircraft_types_1.AircraftSpeed(1, 'VFE', 120, vfeDescription),
    new aircraft_types_1.AircraftSpeed(2, 'TAS', 145, tasDescription),
    new aircraft_types_1.AircraftSpeed(3, 'VNE', 200, vneDescription),
    new aircraft_types_1.AircraftSpeed(4, 'VX', 75, vxDescription),
    new aircraft_types_1.AircraftSpeed(5, 'VY', 96, vyDescription),
    new aircraft_types_1.AircraftSpeed(6, 'VPD', 135, psdDescription),
    new aircraft_types_1.AircraftSpeed(7, 'VSO', 56, vsoDescription),
    new aircraft_types_1.AircraftSpeed(8, 'VS', 65, vsDescription),
    new aircraft_types_1.AircraftSpeed(9, 'VA', 131, vaDescription),
    new aircraft_types_1.AircraftSpeed(10, 'VR', 70, vrDescription),
];
var aircraftWeightsCirrusSR20 = [
    new aircraft_types_1.AircraftWeight(1, 'MTOW', 1631, mtowDescription),
    new aircraft_types_1.AircraftWeight(2, 'BAG', 59, baggageDescription),
    new aircraft_types_1.AircraftWeight(3, 'BEW', 835, bewDescription),
    new aircraft_types_1.AircraftWeight(4, 'MLW', 1631, mlwDescription),
    new aircraft_types_1.AircraftWeight(5, 'Max Payload', 415, payloadDescription),
];
var aircraftSpeedsPA28 = [
    new aircraft_types_1.AircraftSpeed(1, 'VFE', 92, vfeDescription),
    new aircraft_types_1.AircraftSpeed(2, 'TAS', 115, tasDescription),
    new aircraft_types_1.AircraftSpeed(3, 'VNE', 157, vneDescription),
    new aircraft_types_1.AircraftSpeed(4, 'VX', 65, vxDescription),
    new aircraft_types_1.AircraftSpeed(5, 'VY', 77, vyDescription),
    new aircraft_types_1.AircraftSpeed(7, 'VSO', 48, vsoDescription),
    new aircraft_types_1.AircraftSpeed(8, 'VS', 52, vsDescription),
    new aircraft_types_1.AircraftSpeed(9, 'VA', 135, vaDescription),
    new aircraft_types_1.AircraftSpeed(10, 'VR', 62, vrDescription),
];
var aircraftWeightsPA28 = [
    new aircraft_types_1.AircraftWeight(1, 'MTOW', 1092, mtowDescription),
    new aircraft_types_1.AircraftWeight(2, 'BEW', 684, bewDescription),
    new aircraft_types_1.AircraftWeight(3, 'MLW', 175, mlwDescription),
    new aircraft_types_1.AircraftWeight(4, 'Max Payload', 3045, payloadDescription),
];
var aircraftSpeedsMooney = [
    new aircraft_types_1.AircraftSpeed(1, 'VFE', 115, vfeDescription),
    new aircraft_types_1.AircraftSpeed(2, 'TAS', 170, tasDescription),
    new aircraft_types_1.AircraftSpeed(3, 'VNE', 175, vneDescription),
    new aircraft_types_1.AircraftSpeed(4, 'VX', 68, vxDescription),
    new aircraft_types_1.AircraftSpeed(5, 'VY', 75, vyDescription),
    new aircraft_types_1.AircraftSpeed(7, 'VSO', 53, vsoDescription),
    new aircraft_types_1.AircraftSpeed(8, 'VS', 58, vsDescription),
    new aircraft_types_1.AircraftSpeed(9, 'VA', 138, vaDescription),
    new aircraft_types_1.AircraftSpeed(10, 'VR', 65, vrDescription),
];
var aircraftWeightsMooney = [
    new aircraft_types_1.AircraftWeight(1, 'MTOW', 1189, mtowDescription),
    new aircraft_types_1.AircraftWeight(2, 'BEW', 750, bewDescription),
    new aircraft_types_1.AircraftWeight(3, 'MLW', 1189, mlwDescription),
    new aircraft_types_1.AircraftWeight(4, 'Max Payload', 415, payloadDescription),
];
exports.aircraftList = [
    new aircraft_types_1.Aircraft(1, "Cessna 172", aircraftSpeedsCessna172, aircraftWeightsCessna172, "/public/images/Cessna172.jpg"),
    new aircraft_types_1.Aircraft(2, "Cirrus SR20", aircraftSpeedsCirrusSR20, aircraftWeightsCirrusSR20, "/public/images/CirrusSR20.jpg"),
    new aircraft_types_1.Aircraft(3, "Piper PA28", aircraftSpeedsPA28, aircraftWeightsPA28, "/public/images/PA28.jpg"),
    new aircraft_types_1.Aircraft(4, "Mooney M20J", aircraftSpeedsMooney, aircraftWeightsMooney, "/public/images/MooneyM20J.jpg")
];
//# sourceMappingURL=mock-aircraft-data.js.map