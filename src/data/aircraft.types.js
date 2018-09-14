"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AircraftSpeed {
    constructor(id, name, val, desc) {
        this.id = id;
        this.name = name;
        this.val = val;
        this.desc = desc;
    }
}
exports.AircraftSpeed = AircraftSpeed;
class AircraftWeight {
    constructor(id, name, val, desc) {
        this.id = id;
        this.name = name;
        this.val = val;
        this.desc = desc;
    }
}
exports.AircraftWeight = AircraftWeight;
class Aircraft {
    constructor(id, name, acSpeeds, acWeights, imageUrl) {
        this.id = id;
        this.name = name;
        this.acSpeeds = acSpeeds;
        this.acWeights = acWeights;
        this.imageUrl = imageUrl;
    }
}
exports.Aircraft = Aircraft;
class AircraftBrief {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.AircraftBrief = AircraftBrief;
//# sourceMappingURL=aircraft.types.js.map