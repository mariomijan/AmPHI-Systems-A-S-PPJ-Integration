export class Journal {
    id: number;
    cpr: string;
    name: string;
    middleName: string;
    lastname: string;
    info: string;
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
        loggers: any[];
    };
    reception: {
        id: number;
        code: number;
        name: string;
        journals: any[];
    };
    creationTime: Date;
    loggers: any[];
    status: string;
}