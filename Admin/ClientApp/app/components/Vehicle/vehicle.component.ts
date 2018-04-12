import { Component } from '@angular/core';
import { Manager } from '../../../Manager';
import { Incident } from './Incident';
import { Reception } from './Reception';
import { Journal } from './Journal';
import { Types } from './Types';
import { Vehicle } from './Vehicle';
import { EmergencyCode } from './EmergencyCode';
import { forEach } from '@angular/router/src/utils/collection';
import { Status } from './Status';

@Component({
    selector: 'vehicle-component',
    templateUrl: './vehicle.component.html'
})
export class VehicleComponent {
    typeName: string;
    vehicleName: string;
    selectedType: Types;
    emergencyCodeName: string;
    statusCode: string;
    statusMeaning: string;
    type: Types;
    vehicle: Vehicle;
    code: EmergencyCode;
    typeRemove: string;
    vehicleRemove: string;
    codeRemove: string;
    statusCodeObj: Status;

    constructor(private manager: Manager) {
        this.manager.getAllVehicleTypes();
        this.manager.getAllVehicles();
        this.manager.getAllEmergencyCodes();
        this.manager.getAllStatuses();
    }

    createType() {
        if (this.typeName != null) {
            if (this.type != null) {
                this.type.name = this.typeName;
                this.manager.updateType(this.type);
                this.typeName = "";
                this.typeRemove = "";
            }
            else {
                this.type = new Types();
                this.type.name = this.typeName;
                this.manager.createType(this.type);
                this.manager.typeList.push(this.type);
                this.typeName = "";
            }
            delete this.type;
        }
        else {
            alert("Skriv venligst en type");  
        }
    }

    createVehicle() {
        if (this.vehicleName != null) {
            if (this.vehicle != null) {
                this.vehicle.name = this.vehicleName;
                this.manager.updateVehicle(this.vehicle);
                this.vehicleName = "";
                this.vehicleRemove = "";
            }

            if (this.vehicleName != null && this.selectedType != null) {
                this.vehicle = new Vehicle();
                this.vehicle.name = this.vehicleName;
                this.vehicle.vehicleType = this.selectedType;
                this.manager.createVehicle(this.vehicle);
                this.manager.vehicleList.push(this.vehicle);
                this.vehicleName = "";
                delete this.selectedType;
            }
        }
        else {
            alert("Udfyld venligst både en type og vogn");
        }
    }

    createEmergencyCode() {
        if (this.emergencyCodeName != null) {
            if (this.code != null) {
                this.code.code = this.emergencyCodeName;
                this.manager.updateEmergencyCode(this.code);
                this.emergencyCodeName = "";
                this.codeRemove = "";
                
            }
            else {
                this.code = new EmergencyCode();
                this.code.code = this.emergencyCodeName;
                this.manager.createEmergencyCode(this.code);
                this.manager.emergencyCodeList.push(this.code);
                this.emergencyCodeName = "";
            }
        }
        else {
            alert("Udfyld venligst en udrykningskode");
        }
    }

    getClickedTypeName(type: Types) {
        this.typeName = type.name;
        this.type = type;
        this.typeRemove = type.name;
    }

    getVehicle(vehicle: Vehicle) {
        this.vehicleName = vehicle.name;
        this.vehicle = vehicle;
        this.vehicleRemove = vehicle.name;
    }

    removeType() {
        if (this.type != null) {
            this.manager.removeType(this.type);

            let index = this.manager.typeList.findIndex(d => d.id === this.type.id); //find index in your array
            this.manager.typeList.splice(index, 1);
            this.typeName = "";
            this.typeRemove = "";
        }
        else {
            alert("Vælg venligst en type");
        }
    }

    removeVehicle() {
        if (this.vehicle != null) {
            this.manager.removeVehicle(this.vehicle);

            let index = this.manager.vehicleList.findIndex(d => d.id === this.vehicle.id); //find index in your array
            this.manager.vehicleList.splice(index, 1);
            this.vehicleName = "";
            this.vehicleRemove = "";
        }
        else {
            alert("Vælg venligst en vogn");
        }
    }

    getEmergencyCode(code: EmergencyCode) {
        this.emergencyCodeName = code.code;
        this.codeRemove = code.code;
        this.code = code;
    }

    removeEmergencyCode() {
        if (this.code != null) {
            this.manager.removeEmergencyCode(this.code);

            let index = this.manager.emergencyCodeList.findIndex(d => d.id === this.code.id); //find index in your array
            this.manager.emergencyCodeList.splice(index, 1);

            this.emergencyCodeName = "";
            this.codeRemove = "";
        }
        else {
            alert("Vælg venligst en udrykningskode");
        }
    }

    createStatus() {
        if (this.statusCode != null && this.statusMeaning != null) {
            if (this.statusCodeObj != null) {
                this.statusCodeObj.code = this.statusCode;
                this.statusCodeObj.meaning = this.statusMeaning;
                this.manager.updateStatus(this.statusCodeObj);
                this.statusCode = "";
                this.statusMeaning = "";
            }
            else {
                this.statusCodeObj = new Status();
                this.statusCodeObj.code = this.statusCode;
                this.statusCodeObj.meaning = this.statusMeaning;
                this.manager.createStatus(this.statusCodeObj);
                this.manager.statusList.push(this.statusCodeObj);
                this.statusCode = "";
                this.statusMeaning = "";
            }
        }
        else {
            alert("Udfyld venligst både status kode og status betydning");
        }
    }

    getStatus(status: Status) {
        this.statusCode = status.code;
        this.statusMeaning = status.meaning;
        this.statusCodeObj = status;
    }

    removeStatus() {
        if (this.statusCodeObj != null) {
            this.manager.removeStatus(this.statusCodeObj);

            let index = this.manager.statusList.findIndex(d => d.id === this.statusCodeObj.id); //find index in your array
            this.manager.statusList.splice(index, 1);

            this.statusCode = "";
            this.statusMeaning = "";
        }
        else {
            alert("Vælg venligst en status");
        }
    }
}
