import { Component, Input, OnInit, Output, EventEmitter, NgZone, SimpleChanges } from '@angular/core';
import { IncidentProxy } from '../../incident.proxy';
import { Incident } from '../incident/Incident';
import { IncidentManager } from '../../incident.manager';
import { FormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { INVALID, VALID } from "@angular/forms/src/model";
import { JournalManager } from "../../journal.manager";
import { PreparednessManager } from "../../preparedness.manager";
import { SignalRService } from "../../SignalR/signalRService";
//declare var swal: any;
declare var $: any;


@Component({
    selector: 'incident-component',
    templateUrl: './incident.component.html'
})
export class IncidentComponent implements OnInit {
    @Input() incident: Incident;
    @Input() isDisabled: boolean;
    @Output() onRemoveIncidentJournalPreparednessBtnIsDisabled = new EventEmitter<boolean>();
    @Output() onIncidentUpdatedBtnIsDisabled = new EventEmitter<boolean>();
    @Output() onRemoveIncidentBtn = new EventEmitter<boolean>();

    constructor(private incidentService: IncidentProxy, private incidentManager: IncidentManager,
        private journalManager: JournalManager, private preparednessManager: PreparednessManager,
        private signalRService: SignalRService) {
    }

    ngOnInit(): void {
        this.isDisabled = true;
        this.incidentManager.subscribeToEvents();
        this.subscribeToClearEvents();
        this.incidentManager.checkIAmAlive();
    }

    checkIAmAlive() {
        alert(this.incidentManager.aliveMessage);
    }

    //SaveIncident button event
    btnSaveIncident() {
        if (this.incident.id != null) {
            this.incidentManager.updateIncident(this.incident);
            this.onRemoveIncidentJournalPreparednessBtnIsDisabled.emit(false);
            this.onIncidentUpdatedBtnIsDisabled.emit(false);
        }
        else {
            this.incident.status = "Aktiv";
            this.incidentManager.saveIncident(this.incident);
        }
        this.incident = new Incident();
    }

    //NewIncident button event and clear the incident part
    btnNewIncidentAndClearIncidentPart() {
        this.incident = new Incident();
        this.journalManager.journallist = [];
        this.preparednessManager.preparednesslist = [];
        this.onRemoveIncidentJournalPreparednessBtnIsDisabled.emit(true);
        this.onRemoveIncidentBtn.emit(true);
        this.onIncidentUpdatedBtnIsDisabled.emit(false);
        this.isDisabled = true;

        //To reset the incident in history if not saved
        this.incidentManager.getAllActiveIncidents();

    }

    //CloseIncident button event
    btnCloseIncident() {
        if (confirm("Er du sikker på at du vil lukke hændelsen?")) {
            this.incidentManager.incident.journals = this.journalManager.journallist;
            this.incidentManager.closeIncident(this.incidentManager.incident);
            this.onRemoveIncidentBtn.emit(true);
            this.incidentManager.incident = this.incident;

            setTimeout(function () {
                alert("Hændelse er lukket");
            }, 500);
        }

        //var self = this;
        //swal({
        //    title: "Advarsel!",
        //    text: "Er du sikker på at du vil lukke hændelsen?",
        //    type: "warning",
        //    showCancelButton: true,
        //    confirmButtonColor: '#5cb85c',
        //    cancelButtonColor: '#f0ad4e',
        //    confirmButtonText: 'Luk hændelse',
        //    cancelButtonText: "Annuller",
        //    allowOutsideClick: false,
        //}).then(
        //    function () {
        //        if (confirm) {
        //            self.incidentManager.incident.journals = self.journalManager.journallist;
        //            self.incidentManager.closeIncident(self.incidentManager.incident);
        //            self.onRemoveIncidentBtn.emit(true);
        //            self.incidentManager.incident = self.incident;
        //            swal({
        //                title: "Hændelse er lukket",
        //                type: "success",
        //                showCancelButton: false,
        //                showConfirmButton: false,
        //                allowOutsideClick: false,
        //                timer: 2000,
        //            }
        //            )
        //        }
        //    });
    }

    subscribeToClearEvents(): void {
        this.signalRService.clearFieldsAndBtnsAfterRemovedIncident.subscribe((data: any) => {
            this.btnNewIncidentAndClearIncidentPart();
        });
    }

    onFocusOfInputFields() {
        this.onRemoveIncidentJournalPreparednessBtnIsDisabled.emit(true);
        if (this.incident.id != null) {
            this.onIncidentUpdatedBtnIsDisabled.emit(true);
        }
    }
}















