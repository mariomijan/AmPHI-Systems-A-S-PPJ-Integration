import { Component, Injectable, NgZone } from '@angular/core';
import { NgStyle } from '@angular/common';
import { PreparednessProxy } from './preparedness.proxy';
import { Preparedness } from './components/Preparedness/preparedness';
import { Vehicle } from "./components/Preparedness/Vehicle";
import { EmergencyCode } from "./components/Preparedness/EmergencyCode";
import { Incident } from "./components/incident/Incident";
import { Types } from "./components/Preparedness/Types";
import { Status } from "./components/Preparedness/Status";
import { Reception } from "./components/Preparedness/Reception";
import { LoggerManager } from './logger.manager';
import { IncidentManager } from "./incident.manager";
import { SignalRService } from "./SignalR/signalRService";

@Injectable()
export class PreparednessManager {

    vehicletypeList: Array<Types> = [];
    ecodeList: Array<EmergencyCode> = [];
    vehicleList: Array<Vehicle> = [];
    statusList: Array<Status> = [];
    receptionList: Array<Reception> = [];
    preparednesslist: Array<Preparedness> = [];
    vehicle: Vehicle;
    emergencyCode: EmergencyCode;
    status: Status;
    incident: Incident;
    preparedness: Preparedness;

    constructor(private preparednessProxy: PreparednessProxy, private loggerManager: LoggerManager, private signalRService: SignalRService, private _ngZone: NgZone) {

    }

    createPreparedness(preparedness: any) {
        this.preparednessProxy
            .createPreparedness(preparedness)
            .subscribe(savedPreparedness => {
                savedPreparedness.emergencyCode = this.emergencyCode;
                savedPreparedness.vehicle = this.vehicle;
                savedPreparedness.vehicle.status = this.status;
                this.preparednesslist.push(savedPreparedness);
                this.loggerManager.getAllLoggersByIncidentId(this.incident.id);
                this.sortThePreparednessList(this.preparednesslist);
                this.preparedness = savedPreparedness;

            }, error => {
                console.log(error)
            });
    }

    //Sort the newly created journals on top
    sortThePreparednessList(JournalList: Array<Preparedness>) {
        var sortedArray: Preparedness[] = JournalList.sort((obj1, obj2) => {
            if (obj1.id < obj2.id) {
                return 1;
            }
            if (obj1.id > obj2.id) {
                return -1;
            }
            return 0;
        });
    }

    getActivePreparednessListByIncidentId(incidentId: any) {
        this._ngZone.run(() => {
            this.preparednessProxy
                .getAllActivePreparednessByIncidentId(incidentId)
                .subscribe(
                data => {
                    //if (data.length == 0) {
                    //    for (var item of data) {
                    //        this.preparednesslist.push(item);
                    //    }
                    //}
                        //else {
                            this.preparednesslist = data;
                        //}
                });
        });

        this.vehicleList = [];
        this.getAllVehicles();

        this.ecodeList = [];
        this.getAllEmergencyCodes();

        this.statusList = [];
        this.getAllStatuses();
    }

    removePreparedness(preparedness: any) {
        this.preparednessProxy.removePreparedness(preparedness)
            .subscribe(removedPrep => {

                //let index = this.preparednesslist.findIndex(d => d.id === preparedness.id); //find index in your array
                //this.preparednesslist.splice(index, 1);

                this.loggerManager.getAllLoggersByIncidentId(this.incident.id);

                this.vehicleList = [];
                this.getAllVehicles();
            });
    }

    getAllEmergencyCodes() {
        var displayECode = this.preparednessProxy.GetAllEmergencyCode();
        displayECode.then((ecodeList) => {
            for (var item of ecodeList) {
                var emergencycode = new EmergencyCode();
                emergencycode.id = item.id;
                emergencycode.code = item.code;
                this.ecodeList.push(emergencycode);

            }
        });
    }

    getAllVehiclesByTypeId(vehicleTypeClickedId: number) {
        var displayVehicle = this.preparednessProxy.getVehiclesByTypeId(vehicleTypeClickedId);
        displayVehicle.then((vehicleList) => {
            for (var vehicle of vehicleList) {
                var vec = new Vehicle();
                vec.id = vehicle.id;
                vec.name = vehicle.name;
                vec.status = vehicle.status;
                this.vehicleList.push(vec);
            }
        });
    }

    getAllVehicleTypes() {
        var vehicleTypePromise = this.preparednessProxy.getAllVehicleTypes();
        vehicleTypePromise.then((vehicletypelist) => {
            for (var item of vehicletypelist) {
                var vehicletype = new Types();
                vehicletype.id = item.id;
                vehicletype.name = item.name;
                this.vehicletypeList.push(vehicletype);
            }
        })
    }

    getAllVehicles() {
        var vehicleTypePromise = this.preparednessProxy.getAllVehicles();
        vehicleTypePromise.then((vehiclelist) => {
            for (var item of vehiclelist) {
                var vehicle = new Vehicle();
                vehicle.id = item.id;
                vehicle.name = item.name;
                if (item.status != null) {
                    vehicle.status = item.status;
                }
                else {
                    vehicle.status = new Status();
                }
                this.vehicleList.push(vehicle);
            }
        })
        return this.vehicleList;
    }

    updatePreparedness(preparedness: any) {
        this.preparednessProxy.updatePreparedness(preparedness)
            .subscribe(savedPreparedness => {
                Object.assign(preparedness, savedPreparedness);

                this.preparednesslist.slice(preparedness);
                this.loggerManager.getAllLoggersByIncidentId(this.incident.id);

                this.vehicleList = [];
                this.getAllVehicles();
            });
    }

    getAllStatuses() {
        var StatusPromise = this.preparednessProxy.getAllStatuses();
        StatusPromise.then((statuslist) => {
            for (var item of statuslist) {
                var status = new Status();
                status.id = item.id;
                status.code = item.code;
                status.meaning = item.meaning
                this.statusList.push(status);
            }
        })
    }

    getAllReceptions() {
        var receptionPromise = this.preparednessProxy.getAllReceptions();
        receptionPromise.then((receptionlist) => {
            for (var item of receptionlist) {
                var reception = new Reception(); 
                reception.id = item.id;
                reception.code = item.code
                reception.name = item.name
                this.receptionList.push(reception);
            }
        })
    }

    subscribeToEvents(): void {
        this.signalRService.preparednessAdded.subscribe((data: any) => {
            this.getActivePreparednessListByIncidentId(this.incident.id);
        });
    }

    createAllocation(preparedness: any) {
        //Create the allocation
        this.preparednessProxy
            .allocation(preparedness)
            .subscribe(allocatedPreparedness => {
                allocatedPreparedness.emergencyCode = this.emergencyCode;
                allocatedPreparedness.vehicle = this.vehicle;
                allocatedPreparedness.vehicle.status = this.status;
                this.preparednesslist.push(allocatedPreparedness);
                this.loggerManager.getAllLoggersByIncidentId(this.incident.id);
            });
    }
}
