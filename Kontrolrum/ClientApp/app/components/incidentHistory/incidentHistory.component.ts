import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IncidentProxy } from '../../incident.proxy';
import { Incident } from '../incident/Incident'
import { IncidentManager } from '../../incident.manager';
import { JournalManager } from "../../journal.manager";
import { PreparednessManager } from "../../preparedness.manager";
import { LoggerManager } from "../../logger.manager";

@Component({
    selector: 'incidentHistory-component',
    templateUrl: './incidentHistory.component.html'
})
export class IncidentHistoryComponent implements OnInit {

    isHidden: boolean;
    isHidden1: boolean;
    setClickedRow: Function;
    selectedRow: number;
    incidentClickedId: number;
    @Output() onIncidentSelected = new EventEmitter<Incident>();
    @Output() onAddJournalPreparednessBtnIsDisabled = new EventEmitter<boolean>();
    @Output() onInActiveIncidentsSelected = new EventEmitter<boolean>();
    @Input() isDisabled: boolean;

    constructor(private incidentService: IncidentProxy, private incidentManager: IncidentManager,
        private journalManager: JournalManager, private preparednessManager: PreparednessManager
        , private loggerManager: LoggerManager, ) {
        //This is to highlight the selected row
        this.setClickedRow = function (index: number) {
            this.selectedRow = index;
        }
    }

    //OngInit to run on startup
    ngOnInit(): void {
        this.incidentManager.getAllActiveIncidents();
        this.incidentManager.subscribeToEvents();
        this.isHidden = true;

    }

    //Get the selected incident, and parse it to the incident component method
    getIncident(selectedIncident: Incident) {
        selectedIncident.loggers = [];

        //To reset same object on edit
        //this.incidentManager.getAllActiveIncidents(); 

        this.journalManager.journallist = [];
        this.preparednessManager.preparednesslist = [];
        this.loggerManager.loggerlist = [];
        this.journalManager.getAllActiveJournalsByIncidentId(selectedIncident.id);
        this.loggerManager.getAllLoggersByIncidentId(selectedIncident.id);
        this.preparednessManager.getActivePreparednessListByIncidentId(selectedIncident.id);
        this.incidentManager.incident = selectedIncident;
        this.incidentManager.incidentId = selectedIncident.id;
        this.preparednessManager.incident = selectedIncident;
        this.onIncidentSelected.emit(selectedIncident);
        this.onAddJournalPreparednessBtnIsDisabled.emit(false);

        if (selectedIncident.status === "Inaktiv") {
            this.onInActiveIncidentsSelected.emit(true);
            this.journalManager.getAllInActiveJournalsByIncidentId(selectedIncident.id);
        }
    }
     
    btnInactive() {
        delete this.selectedRow;
        this.incidentManager.GetAllInActiveIncidents();
        this.isHidden = false;
        this.isHidden1 = true;
        var emptyIncident = new Incident();
        this.onIncidentSelected.emit(emptyIncident);
        this.onAddJournalPreparednessBtnIsDisabled.emit(true);
        this.journalManager.journallist = [];
        this.preparednessManager.preparednesslist = [];

    }

    btnactive() {
        delete this.selectedRow;
        this.incidentManager.getAllActiveIncidents();
        this.isHidden1 = false;
        this.isHidden = true;
        var emptyIncident = new Incident();
        this.onIncidentSelected.emit(emptyIncident);
        this.onAddJournalPreparednessBtnIsDisabled.emit(true);
        this.journalManager.journallist = [];
        this.preparednessManager.preparednesslist = [];

    }
}

