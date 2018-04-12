export class Incident {
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
}