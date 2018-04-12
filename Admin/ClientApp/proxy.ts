import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Types } from './app/components/Vehicle/Types';
import { Type } from '@angular/core/src/type';
import { Observable } from "rxjs/Rx";
import { Journal } from './app/components/Vehicle/Journal';
import 'rxjs/add/operator/toPromise'
import { Vehicle } from './app/components/Vehicle/Vehicle';
import { EmergencyCode } from './app/components/Vehicle/EmergencyCode';
import { Status } from './app/components/Vehicle/Status';

@Injectable()
export class Proxy {
   
    private createTypeUrl = 'http://localhost:49813/api/admin/CreateType';
    private vehicleTypesUrl = 'http://localhost:49813/api/admin/GetAllVehicleTypes';
    private createVehicleUrl = 'http://localhost:49813/api/admin/CreateVehicle';
    private createEmergencyCodeUrl = 'http://localhost:49813/api/admin/CreateEmergencyCode';
    private updateTypeUrl = 'http://localhost:49813/api/admin/UpdateType';
    private removeTypeUrl = 'http://localhost:49813/api/admin/RemoveType';
    private vehicleUrl = 'http://localhost:49813/api/admin/GetAllVehicles';
    private updateVehicleUrl = 'http://localhost:49813/api/admin/UpdateVehicle';
    private removeVehicleUrl = 'http://localhost:49813/api/admin/RemoveVehicle';
    private emergencyCodeUrl = 'http://localhost:49813/api/admin/GetAllEmergencyCodes';
    private updateEmergencyCodeUrl = 'http://localhost:49813/api/admin/UpdateEmergencyCode';
    private removeEmergencyCodeUrl = 'http://localhost:49813/api/admin/RemoveEmergencyCode';
    private createStatusUrl = 'http://localhost:49813/api/admin/CreateStatus';
    private statusUrl = 'http://localhost:49813/api/admin/GetAllStatuses';
    private updateStatusUrl = 'http://localhost:49813/api/admin/UpdateStatus';
    private removeStatusUrl = 'http://localhost:49813/api/admin/RemoveStatus';


    constructor(private http: Http) {
    }

    createType(type: Types) {
           this.http.post(this.createTypeUrl, type).toPromise()
            .then(response => response.json() as Types)
            .catch(this.handleError);
    }

    updateType(type: any) {
        this.http.put(this.updateTypeUrl, type).toPromise()
            .then(response => response.json() as Types)
            .catch(this.handleError);
    }

    updateVehicle(vehicle: any) {
        this.http.put(this.updateVehicleUrl, vehicle).toPromise()
            .then(response => response.json() as Vehicle)
            .catch(this.handleError);
    }


    getAllVehicleTypes() {
        return this.http.get(this.vehicleTypesUrl).toPromise()
            .then(response => response.json() as Types)
            .catch(this.handleError);
    }

    getAllVehicles() {
        return this.http.get(this.vehicleUrl).toPromise()
            .then(response => response.json() as Vehicle)
            .catch(this.handleError);
    }


    createVehicle(vehicle: any) {
        this.http.post(this.createVehicleUrl, vehicle).toPromise()
            .then(response => response.json() as Vehicle)
            .catch(this.handleError);
    }

    createEmergencyCode(code: any) {
        this.http.post(this.createEmergencyCodeUrl, code).toPromise()
            .then(response => response.json() as EmergencyCode)
            .catch(this.handleError);
    }

    removeType(type: any) {
        this.http.put(this.removeTypeUrl, type).toPromise()
            .then(response => response.json() as Types)
            .catch(this.handleError);
    }

    removeVehicle(vehicle: any) {
        this.http.put(this.removeVehicleUrl, vehicle).toPromise()
            .then(response => response.json() as Vehicle)
            .catch(this.handleError);
    }

    getAllEmergencyCode() {
        return this.http.get(this.emergencyCodeUrl).toPromise()
            .then(response => response.json() as EmergencyCode)
            .catch(this.handleError);
    }

    updateEmergencyCode(code: any) {
        this.http.put(this.updateEmergencyCodeUrl, code).toPromise()
            .then(response => response.json() as EmergencyCode)
            .catch(this.handleError);
    }

    removeEmergencyCode(code: any) {
        this.http.put(this.removeEmergencyCodeUrl, code).toPromise()
            .then(response => response.json() as EmergencyCode)
            .catch(this.handleError);

    }

    createStatus(status: any) {
        this.http.post(this.createStatusUrl, status).toPromise()
            .then(response => response.json() as Status)
            .catch(this.handleError);
    }

    getAllStatuses() {
        return this.http.get(this.statusUrl).toPromise()
            .then(response => response.json() as Status)
            .catch(this.handleError);
    }

    updateStatus(status: any) {
        this.http.put(this.updateStatusUrl, status).toPromise()
            .then(response => response.json() as Status)
            .catch(this.handleError);
    }

    removeStatus(status: any) {
        this.http.put(this.removeStatusUrl, status).toPromise()
            .then(response => response.json() as Status)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
