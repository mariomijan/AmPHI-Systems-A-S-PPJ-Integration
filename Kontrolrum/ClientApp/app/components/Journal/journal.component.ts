import { Component } from '@angular/core';
import { JournalProxy } from '../../journal.proxy'
import { Journal } from '../Journal/Journal'
import { OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Incident } from '../incident/Incident';
import { JournalManager } from '../../journal.manager';
import { Reception } from "../Preparedness/Reception";

@Component({
    selector: 'journal-component',
    templateUrl: './journal.component.html',
    exportAs: "child",
})
export class JournalComponent implements OnInit {

    setClickedRow: Function;
    journalClickedId: number;
    selectedRow: number;
    @Input() isDisabled: boolean;
    @Input() incident: Incident;
    @Output() onJournalSelected = new EventEmitter<Journal>();
    @ViewChild('openModal') openModal: ElementRef;


    constructor(private journalManager: JournalManager) {
        //This is to highlight the selected row
        this.setClickedRow = function (index: number) {
            this.selectedRow = index;
        }
    }

    //OngInit to run on startup
    ngOnInit(): void {
        this.isDisabled = true;
        this.journalManager.subscribeToEvents();
    }

    //Get the journal clicked id, and return it
    getJournal(selectedJournal: Journal) {
        var existingJournal = this.journalManager.getJournal(selectedJournal.id);
        this.journalManager.getJournal(selectedJournal.id).then(existingJournal => {
            selectedJournal.middleName = existingJournal.middleName;
            selectedJournal.lastname = existingJournal.lastname;

            if (existingJournal.reception != null) {
                selectedJournal.reception = existingJournal.reception;
            }
            else {
                selectedJournal.reception = new Reception();
            }

            this.onJournalSelected.emit(selectedJournal);
        });
    }

    openUpdateModal() {
        if (this.incident.status == "Aktiv") {
            this.openModal.nativeElement.click();
        }
    }

    AddJournalModal() {
        delete this.selectedRow;
    }
}
