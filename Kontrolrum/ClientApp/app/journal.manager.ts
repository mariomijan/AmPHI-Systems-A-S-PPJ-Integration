import { Injectable, Output, EventEmitter, NgZone } from '@angular/core';
import { JournalProxy } from './journal.proxy';
import { Journal } from './components/Journal/Journal';
import { Incident } from './components/Incident/Incident';
import { LoggerManager } from './logger.manager';
import { Reception } from "./components/Preparedness/Reception";
import { Logger } from "./components/Logger/Logger";
import { SignalRService } from "./SignalR/signalRService";
import { IncidentManager } from "./incident.manager";
import { PreparednessManager } from "./preparedness.manager";


@Injectable()
export class JournalManager {
    journallist: Array<Journal> = [];
    reception: Reception;

    constructor(private journalProxy: JournalProxy, private loggerManager: LoggerManager,
        private incidentManager: IncidentManager, private signalRService: SignalRService,
        private _ngZone: NgZone, private preparednessManager: PreparednessManager ) {

    }

    createJournal(journal: any) {
        this.journalProxy
            .createJournal(journal)
            .subscribe(savedJournal => {
                this.loggerManager.getAllLoggersByIncidentId(this.incidentManager.incident.id);
                this.sortTheJournalsList(this.journallist);

            }, error => {
                console.log(error)
            });
    }

    subscribeToEvents(): void {
        this.signalRService.journalAdded.subscribe((data: any) => {
            this.getAllActiveJournalsByIncidentId(this.incidentManager.incident.id);
        });
    }

    //Sort the newly created journals on top
    sortTheJournalsList(JournalList: Array<Journal>) {
        var sortedArray: Journal[] = JournalList.sort((obj1, obj2) => {
            if (obj1.id < obj2.id) {
                return 1;
            }
            if (obj1.id > obj2.id) {
                return -1;
            }
            return 0;
        });
    }

    getAllActiveJournalsByIncidentId(incidentId: any) {
        this._ngZone.run(() => {
            this.journalProxy
                .getAllActiveJournalsByIncidentId(incidentId)
                .subscribe(
                data => {
                    this.journallist = data;
                });
        });
    }

    getAllInActiveJournalsByIncidentId(incidentId: any) {
        this._ngZone.run(() => {
            this.journalProxy
                .getAllInActiveJournalsByIncidentId(incidentId)
                .subscribe(
                data => {
                    this.journallist = data;
                });
        });
    }

    getJournal(journalId: number) {
        return this.journalProxy.getJournal(journalId);
    }

    updateJournal(journal: any) {
        this.journalProxy.updateJournal(journal)
            .subscribe(savedJournal => {
                this.journallist.slice(journal);
                this.loggerManager.getAllLoggersByIncidentId(this.preparednessManager.incident.id);

            }, error => {
                console.log(error)
            });
    }
}