import { Injectable, Output, EventEmitter, NgZone } from '@angular/core';
import { IncidentProxy } from '../app/incident.proxy';
import { Incident } from "./components/incident/Incident";
import { PreparednessManager } from "./preparedness.manager";
import { Preparedness } from "./components/Preparedness/preparedness";
import { LoggerManager } from "./logger.manager";
import { Logger } from "./components/Logger/Logger";
import { SignalRService } from "./SignalR/signalRService";

@Injectable()
export class IncidentManager {
    incidentId: number;
    incidentlist: Incident[] = [];
    inactivelist: Array<Incident> = [];
    incident: Incident;
    aliveMessage: string;

    constructor(private incidentProxy: IncidentProxy, private preparednessManager: PreparednessManager,
        private loggerManager: LoggerManager, private _ngZone: NgZone, private signalRService: SignalRService) {
    }

    checkIAmAlive() {
        //this.incidentProxy.checkIAmAlive().then((theAliveMessage) => {
        //    this.aliveMessage = theAliveMessage; 
        //});
    }

    saveIncident(incident: Incident) {
        this.incidentProxy
            .saveIncident(incident)
            .subscribe(savedIncident => {
                this.incidentlist.push(savedIncident);
                this.loggerManager.getAllLoggersByIncidentId(savedIncident.id);

                //if (this.loggerManager.loggerlist.length == 0) {
                //    this.loggerManager.loggerlist = savedIncident.loggers;
                //}
                //else {
                //    for (var item of savedIncident.loggers) {
                //        this.loggerManager.loggerlist.push(item);
                //    }
                //}
                 
                this.sortTheIncidentHistoryList(this.incidentlist);
                this.loggerManager.sortTheLoggerList(this.loggerManager.loggerlist);

            }, error => {
                console.log(error)
            });
    }

    getAllActiveIncidents() {
        this.incidentlist = [];
        this._ngZone.run(() => {
            this.incidentProxy
                .getAllActiveIncidents()
                .subscribe(
                data => {
                    this.incidentlist = data;
                });
            //},
            //error => console.log(error),
            //() => console.log('Error has occured'));
        });
    }

    subscribeToEvents(): void {
        this.signalRService.incidentChanged.subscribe((data: any) => {
            this.getAllActiveIncidents();
        });
    }

    //subscribeToInactiveEvents(): void {
    //    this.signalRService.incidentChanged.subscribe((data: any) => {
    //        this.GetAllInActiveIncidents();
    //    });
    //}

    //Sort the newly created incidents on top
    sortTheIncidentHistoryList(incidentList: Array<Incident>) {
        var sortedArray: Incident[] = incidentList.sort((obj1, obj2) => {
            if (obj1.id < obj2.id) {
                return 1;
            }
            if (obj1.id > obj2.id) {
                return -1;
            }
            return 0;
        });
    }

    updateIncident(incident: Incident) {
        this.incidentProxy.updateIncident(incident).then(updatedIncident => {
            Object.assign(incident, updatedIncident);
            this.loggerManager.getAllLoggersByIncidentId(updatedIncident.id);

            //if (this.loggerManager.loggerlist.length == 0) {
            //    this.loggerManager.loggerlist = incident.loggers;
            //}
            //else {
            //    for (var item of incident.loggers) {
            //        this.loggerManager.loggerlist.push(item);
            //    }
            //    this.loggerManager.sortTheLoggerList(this.loggerManager.loggerlist);
            //}
        });
    }

    GetAllInActiveIncidents() {
        this.incidentlist = [];
        var inactive = this.incidentProxy.GetAllInActiveIncidents();
        inactive.then((inactivelist) => {
            for (var item of inactivelist) {
                var newinactive = new Incident();
                newinactive.id = item.id;
                newinactive.address = item.address;
                newinactive.number = item.number;
                newinactive.postNr = item.postNr;
                newinactive.city = item.city;
                newinactive.description = item.description;
                newinactive.status = item.status;
                this.incidentlist.push(newinactive);

            }
        });
    }


    closeIncident(incident: Incident) {
        incident.preparednesses = [];
        incident.preparednesses = this.preparednessManager.preparednesslist;
        this.incidentProxy
            .closeIncident(incident)
            .subscribe(closedIncident => {
                this.loggerManager.getAllLoggersByIncidentId(closedIncident.id);

                //let index = this.incidentlist.findIndex(d => d.id === incident.id); //find index in your array
                //this.incidentlist.splice(index, 1);

                this.preparednessManager.vehicleList = [];
                this.preparednessManager.getAllVehicles();

                this.loggerManager.getAllLoggersByIncidentId(incident.id);

                //if (this.loggerManager.loggerlist.length == 0) {
                //    this.loggerManager.loggerlist = savedIncident.loggers;
                //}
                //else {
                //    for (var item of savedIncident.loggers) {
                //        this.loggerManager.loggerlist.push(item);
                //    }
                //}

                this.sortTheIncidentHistoryList(this.incidentlist);
                this.loggerManager.sortTheLoggerList(this.loggerManager.loggerlist);

            }, error => {
                console.log(error)
            });
    }
}
