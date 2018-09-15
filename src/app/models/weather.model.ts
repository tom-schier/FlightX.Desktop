export class WindDetails {
    id: number;
    speed: number;
    direction: number;
    altitude: string;
    isReadOnly: boolean;
    sector: number;
    btnEditClass: string;
    btnRemoveClass: string;
}

export class CloudDetails {
    id: number;
    cloudType: number;
    coverage: number;
    altitude: string;
    isReadOnly: boolean;
    sector: number;
}