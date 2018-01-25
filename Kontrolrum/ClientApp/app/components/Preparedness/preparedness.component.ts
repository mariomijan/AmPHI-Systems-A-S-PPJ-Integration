import { Component } from '@angular/core';
import { PreparednessProxy } from '../../preparedness.proxy'
import { Preparedness } from '../Preparedness/preparedness';
import { OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { EmergencyCode } from "./EmergencyCode";
import { Vehicle } from "./Vehicle";
import { PreparednessManager } from '../../preparedness.manager';
import { JournalManager } from "../../journal.manager";
import { Status } from "./Status";
import { IncidentManager } from "../../incident.manager";


@Component({
    selector: 'preparedness-component',
    templateUrl: './preparedness.component.html',
    exportAs: "child",
})

export class PreparednessComponent implements OnInit {
    preparednessClickedId: number;
    emergencyCode: EmergencyCode;
    vehicleId: number;
    preparednesslist: Array<Preparedness> = [];
    setClickedRow: Function;
    selectedRow: number;
    @Input() isDisabled: boolean;
    @Input() isDisabledRemove: boolean;
    @ViewChild('openPreparednessUpdateModal') openModal: ElementRef;
    @Output() onPreparednessSelected = new EventEmitter<Preparedness>();

    constructor(private preparednessProxy: PreparednessProxy, private preparednessManager: PreparednessManager,
        private journalManager: JournalManager, private incidentManager: IncidentManager) {
        //This is to highlight the selected row
        this.setClickedRow = function (index: number) {
            this.selectedRow = index;
        }
    }

    ngOnInit(): void {
        this.isDisabled = true;
        this.isDisabledRemove = true;
        this.preparednessManager.subscribeToEvents();
    }

    getPreparedness(preparedness: Preparedness) {
        if (preparedness.vehicle.status == null) {
            preparedness.vehicle.status = new Status();
        }
        else {
            this.onPreparednessSelected.emit(preparedness);
            this.preparednessClickedId = preparedness.id;
            this.vehicleId = preparedness.vehicle.id;
            this.emergencyCode = preparedness.emergencyCode;
            this.isDisabledRemove = false;
        }
    }

    btnRemovePreparedness() {
        var preparedness = new Preparedness();
        preparedness.id = this.preparednessClickedId;
        preparedness.incident = this.incidentManager.incident;
        preparedness.vehicle = new Vehicle();
        preparedness.vehicle.id = this.vehicleId;
        preparedness.emergencyCode = this.emergencyCode;
        this.preparednessManager.removePreparedness(preparedness);
        this.isDisabledRemove = true;
        delete this.selectedRow;

    }

    openUpdateModal() {
        this.openModal.nativeElement.click();
    }

    btnAddPreparedness() {
        delete this.selectedRow;
    }
}





