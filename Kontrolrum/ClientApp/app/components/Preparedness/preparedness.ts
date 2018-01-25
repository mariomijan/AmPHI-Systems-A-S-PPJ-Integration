export class Preparedness {
    id: number;
    vehicle: {
        id: number;
        name: string;
        vehicleType: {
            id: number;
            name: string;
            vehicles: any[];

        };
        status: {
            id: number;
            code: string;
            meaning: string;
            vehicles: any[];
        }
    };
    incident: {
        id: number;
        address: string;
        number: string;
        postNr: string;
        city: string;
        description: string;
        status: string;
        journals: any[];
        preparednesses: any[];
        creationTime: Date;
    };
    emergencyCode: {
        id: number;
        code: string;
        preparednesses: any[];
    };
    creationTime: Date;
    status: string;
    loggers: any[];
}



