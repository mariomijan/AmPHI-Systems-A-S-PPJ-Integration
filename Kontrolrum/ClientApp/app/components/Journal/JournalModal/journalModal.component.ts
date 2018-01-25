import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { JournalComponent } from '../journal.component';
import { JournalProxy } from '../../../journal.proxy';
import { Journal } from '../Journal';
import { Incident } from '../../incident/Incident';
import { IncidentProxy } from '../../../incident.proxy';
import { JournalManager } from '../../../journal.manager';
import { NgbAlertConfig } from "@ng-bootstrap/ng-bootstrap";
import { IncidentManager } from '../../../incident.manager';
import { PreparednessManager } from "../../../preparedness.manager";
import { Reception } from "../../Preparedness/Reception";

@Component({
    selector: 'journalModal-component',
    templateUrl: './journalModal.component.html',
})
export class JournalModalComponent implements OnInit {
    txtCpr: string;
    txtName: string;
    txtMiddleName: string;
    txtLastname: string;
    txtInfo: string;
    selectedReception: Reception;

    constructor(private journalProxy: JournalProxy, private incidentService: IncidentProxy,
        private journalManager: JournalManager, private incidentManager: IncidentManager,
    private preparednessManager: PreparednessManager) {
    }

    ngOnInit(): void {
        this.preparednessManager.getAllReceptions();
    }

    btnOk() {
        var journal = {
            cpr: this.txtCpr, name: this.txtName, middleName: this.txtMiddleName, lastname: this.txtLastname, info: this.txtInfo, incident: new Incident(), reception: new Reception()
        };

        //We call this method on the service
        journal.incident = this.incidentManager.incident;

        journal.incident.id = this.incidentManager.incidentId;
        journal.reception = this.selectedReception;

        this.journalManager.reception = this.selectedReception;

        this.journalManager.createJournal(journal);

        this.preparednessManager.receptionList = [];
        this.preparednessManager.getAllReceptions();

        this.txtCpr = "";
        this.txtName = "";
        this.txtMiddleName = "";
        this.txtLastname = "";
        this.txtInfo = "";
    }

    btnCancel() {
        this.preparednessManager.receptionList = [];
        this.preparednessManager.getAllReceptions();
        this.txtCpr = "";
        this.txtName = "";
        this.txtMiddleName = "";
        this.txtLastname = "";
        this.txtInfo = "";
    }
}


