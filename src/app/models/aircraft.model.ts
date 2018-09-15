export class AircraftSpeed {
    constructor(public id: number, public name: string, public val: number, public desc: string) { }
}

export class AircraftWeight {
    constructor(public id: number, public name: string, public val: number, public desc: string) { }
}

export class Aircraft {
    constructor(public id: number, public name: string, public acSpeeds: AircraftSpeed[],
        public acWeights: AircraftWeight[], public imageUrl: string) {
    }
}

export class AircraftBrief {
    constructor(public id: number, public name: string) { }
}