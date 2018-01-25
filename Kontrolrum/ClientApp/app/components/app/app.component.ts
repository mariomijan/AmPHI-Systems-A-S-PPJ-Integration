import { Component, OnInit } from '@angular/core';
import { Incident } from '../incident/Incident';
import { IncidentProxy } from '../../incident.proxy';
import { IncidentManager } from '../../incident.manager';
import { Journal } from "../Journal/Journal";
import { Preparedness } from "../Preparedness/preparedness";
import { EmergencyCode } from "../Preparedness/EmergencyCode";
import { Reception } from "../Preparedness/Reception";
import { Status } from "../Preparedness/Status";
import { Vehicle } from "../Preparedness/Vehicle";

@Component({
    selector: 'app',
    templateUrl: './app.component.html', 
    styleUrls: ['./app.component.css']
})
export class AppComponent  {

    constructor(private incidentManager: IncidentManager) {

    }

    ngOnInit(): void {
    }

    selectedIncident: Incident = new Incident();
    selectedJournal: Journal = new Journal();
    selectedReception: Reception = new Reception();
    selectedPreparedness: Preparedness = new Preparedness();
    selectedVehicle: Vehicle = new Vehicle();
    selectedStatus: Status = new Status();
    selectedCode: EmergencyCode = new EmergencyCode();
    addJournalPreparednessBtnisDisabledAndRemoveIncidentField: boolean;
    removeIncidentBtnisDisabled: boolean;
    disableIncidentHistoryBtns: boolean;

    IncidentSelected(incident: Incident) {
        this.selectedIncident = incident;
    }

    JournalSelected(journal: Journal) {
        this.selectedJournal = journal;
        this.selectedReception = journal.reception;
    }

    PreparednessSelected(preparedness: Preparedness) {
        this.selectedPreparedness = preparedness;
        this.selectedStatus = preparedness.vehicle.status;
        this.selectedCode = preparedness.emergencyCode;
        this.selectedVehicle = preparedness.vehicle;
    }

    AddJournalPreparednessBtnIsDisabledAndRemoveIncident(isDisabled: boolean) {
        this.addJournalPreparednessBtnisDisabledAndRemoveIncidentField = isDisabled;
    }

    DisableIncidentHistoryBtns(disabled: boolean) {
        this.disableIncidentHistoryBtns = disabled;
    }

    RemoveIncident(isDisabled: boolean) {
        this.removeIncidentBtnisDisabled = isDisabled;
    }
}
