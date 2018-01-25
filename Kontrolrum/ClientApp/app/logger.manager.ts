import { Component, Injectable, NgZone } from '@angular/core';
import { Logger } from "./components/Logger/Logger";
import { LoggerProxy } from "./logger.proxy";
import { SignalRService } from "./SignalR/signalRService";
import { Incident } from "./components/incident/Incident";
import { IncidentManager } from "./incident.manager";


@Injectable()
export class LoggerManager {

    loggerlist: Array<Logger> = [];
    incidentManager: IncidentManager;

    constructor(private loggerProxy: LoggerProxy, private signalRService: SignalRService,
        private _ngZone: NgZone) {
    }

    getAllLoggersByIncidentId(incidentId: any) {
        //this.loggerlist = [];
        this._ngZone.run(() => {
            this.loggerProxy
                .getAllLoggersByIncidentId(incidentId)
                .subscribe(
                data => {
                    if (this.loggerlist.length == 0) {
                        this.loggerlist = data;
                    }
                    else {
                        for (var item of data) {
                            for (var item2 of this.loggerlist) {
                                if (item.id != item2.id) {
                                    this.loggerlist = data;
                                }
                            }
                        }
                        this.sortTheLoggerList(this.loggerlist);
                    }
                });
        });
    }

    //Sort the newly created loggers on top
    sortTheLoggerList(LoggerList: Array<Logger>) {
        var sortedArray: Logger[] = LoggerList.sort((obj1, obj2) => {
            if (obj1.id < obj2.id) {
                return 1;
            }
            if (obj1.id > obj2.id) {
                return -1;
            }
            return 0;
        });
    }
}
