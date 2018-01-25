import { Component, Input, OnInit } from '@angular/core';
import { IncidentManager } from "../../../incident.manager";
import { Journal } from "../Journal";
import { Incident } from "../../incident/Incident";
import { JournalManager } from "../../../journal.manager";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Reception } from "../../Preparedness/Reception";
import { PreparednessManager } from "../../../preparedness.manager";

@Component({
    selector: 'updateJournal-component',
    templateUrl: './journalUpdateModal.component.html'
})
export class UpdateJournalComponent implements OnInit {

    @Input() journal: Journal;
    @Input() theSelectedReception: Reception;

    constructor(private incidentManager: IncidentManager, private journalManager: JournalManager,
    private preparednessManager: PreparednessManager) {
    }

    ngOnInit(): void {
    }

    btnOk(selectedReceptionId: number, selectedCpr: string, selectedName: string, selectedMiddleName: string,
        selectedLastname: string, selectedInfo: string) {

        this.journal.incident = this.incidentManager.incident; 

        if (selectedReceptionId > 0) {
            this.journal.reception.id = selectedReceptionId;
        }
        this.journal.cpr = selectedCpr;
        this.journal.name = selectedName;
        this.journal.middleName = selectedMiddleName;
        this.journal.lastname = selectedLastname;
        this.journal.info = selectedInfo;
        this.journalManager.updateJournal(this.journal);
    }
}
