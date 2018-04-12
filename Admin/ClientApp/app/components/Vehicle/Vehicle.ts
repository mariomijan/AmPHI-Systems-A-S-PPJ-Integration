export class Vehicle {
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
    };
}
