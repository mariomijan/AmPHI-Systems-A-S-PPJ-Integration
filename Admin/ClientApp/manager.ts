import { Injectable } from "@angular/core";
import { Proxy } from './proxy';
import { Journal } from "./app/components/Vehicle/Journal";
import { Types } from "./app/components/Vehicle/Types";
import { Vehicle } from "./app/components/Vehicle/Vehicle";
import { EmergencyCode } from "./app/components/Vehicle/EmergencyCode";
import { Status } from "./app/components/Vehicle/Status";

@Injectable()
export class Manager {
    
    typeList: Array<Types> = [];
    vehicleList: Array<Vehicle> = [];
    emergencyCodeList: Array<EmergencyCode> = [];
    statusList: Array<Status> = [];

    constructor(private proxy: Proxy) {
        
    }

    createType(type: any) {
        this.proxy.createType(type);
    }

    updateType(type: any) {
        this.proxy.updateType(type);
    }

    updateVehicle(vehicle: any) {
        this.proxy.updateVehicle(vehicle);
    }


    createVehicle(vehicle: any) {
        this.proxy.createVehicle(vehicle);
    }

    getAllVehicleTypes() {
        this.proxy.getAllVehicleTypes().then(list => {
            this.typeList = list;
        })
    }

    getAllVehicles() {
        this.proxy.getAllVehicles().then(list => {
            this.vehicleList = list;
        });
    }


    createEmergencyCode(code: any) {
        this.proxy.createEmergencyCode(code);
    }

    removeType(type: any) {
        this.proxy.removeType(type);
    }

    removeVehicle(vehicle: any) {
        this.proxy.removeVehicle(vehicle);
    }

    getAllEmergencyCodes() {
        this.proxy.getAllEmergencyCode().then(list => {
            this.emergencyCodeList = list;
        });
    }

    updateEmergencyCode(code: any) {
        this.proxy.updateEmergencyCode(code);
    }

    removeEmergencyCode(code: any) {
        this.proxy.removeEmergencyCode(code);
    }

    createStatus(status: any) {
        this.proxy.createStatus(status);
    }

    getAllStatuses() {
        this.proxy.getAllStatuses().then(list => {
            this.statusList = list;
        });
    }

    updateStatus(status: any) {
        this.proxy.updateStatus(status);
    }

    removeStatus(status: any) {
        this.proxy.removeStatus(status);
    }

}
