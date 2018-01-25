import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Preparedness } from '../../ClientApp/app/components/Preparedness/preparedness';
import { Vehicle } from '../app/components/Preparedness/Vehicle';
import { Types } from '../app/components/Preparedness/Types';
import { Incident } from "./components/incident/Incident";
import { EmergencyCode } from "./components/Preparedness/EmergencyCode";
import { Status } from "./components/Preparedness/Status";
import { Reception } from "./components/Preparedness/Reception";
import { Observable } from "rxjs/Rx";
import 'rxjs/Rx';
//import { CONFIGURATION } from '../app/app.constants';
    
@Injectable()
export class PreparednessProxy {
    private preparednessUrl = this.proxy + 'api/preparedness/';
    private vehicletypeUrl = this.proxy + 'api/vehicletype/';
    private vehicleUrl = this.proxy + 'api/vehicle/';
    private getAllStatusUrl = this.proxy + 'api/preparedness/GetAllStatuses';
    private getAllReceptionsUrl = this.proxy + 'api/preparedness/GetAllReceptions';
    private createPreparednessUrl = this.proxy + 'api/preparedness/CreatePreparedness';
    private allocationUrl = this.proxy + 'api/preparedness/Allocation';

    constructor(private http: Http, @Inject('PROXY_URL') private proxy: any) {
    }

    createPreparedness = (preparedness: any): Observable<Preparedness> => {
        return this.http.post(this.createPreparednessUrl, preparedness)
            .map((response: Response) => <Preparedness>response.json())
            .catch(this.handleError);
    } 

    allocation = (preparedness: any): Observable<Preparedness> => {
        return this.http.post(this.allocationUrl, preparedness)
            .map((response: Response) => <Preparedness>response.json())
            .catch(this.handleError);
    }

    updatePreparedness = (preparedness: any): Observable<Preparedness> => {
        return this.http.put(this.preparednessUrl, preparedness)
            .map((response: Response) => <Preparedness>response.json())
            .catch(this.handleError);
    }

    getAllActivePreparednessByIncidentId = (incidentId: any): Observable<Preparedness[]> => {
        return this.http.get(this.preparednessUrl + incidentId, incidentId)
            .map((response: Response) => <Preparedness[]>response.json())
            .catch(this.handleError);
    }
    removePreparedness = (preparedness: any): Observable<Preparedness> => {
        return this.http.put(this.preparednessUrl + preparedness, preparedness)
            .map((response: Response) => <Preparedness>response.json())
            .catch(this.handleError);
        
    }

    getAllVehicleTypes(): Promise<Types[]> {
        return this.http.get(this.vehicletypeUrl).toPromise()
            .then(response => response.json() as Types[])
            .catch(this.handleError);
    }

    getVehiclesByTypeId(typeid: any): Promise<Vehicle[]> {
        return this.http.get(this.vehicleUrl + typeid, typeid).toPromise()
            .then(response => response.json() as Vehicle[])
            .catch(this.handleError);
    }

    getVehicle(id: any) {
        return this.http.get(this.vehicleUrl + id, id).toPromise().
            then(response => response.json() as Vehicle).catch(this.handleError);
    }

    GetAllEmergencyCode(): Promise<EmergencyCode[]> {
        return this.http.get(this.preparednessUrl).toPromise().
            then(response => response.json() as EmergencyCode)
            .catch(this.handleError);
    }

    getAllStatuses(): Promise<Status[]> {
        return this.http.get(this.getAllStatusUrl).toPromise().
            then(response => response.json() as Status).catch(this.handleError);
    }

    getAllReceptions(): Promise<Reception[]> {
        return this.http.get(this.getAllReceptionsUrl).toPromise().
            then(response => response.json() as Reception).catch(this.handleError);
    }

    getAllVehicles(): Promise<Vehicle[]> {
        return this.http.get(this.vehicleUrl).toPromise()
            .then(response => response.json() as Vehicle[])
            .catch(this.handleError);
    }

    //This is for the error handling
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        //alert("Der er opstået en fejl");
        return Promise.reject(error.message || error);
    }
}