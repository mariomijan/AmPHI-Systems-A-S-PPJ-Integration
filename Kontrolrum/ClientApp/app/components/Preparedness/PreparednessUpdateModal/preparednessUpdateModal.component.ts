import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { PreparednessManager } from "../../../preparedness.manager";
import { Preparedness } from "../preparedness";
import { EmergencyCode } from "../EmergencyCode";
import { Status } from "../Status";
import { IncidentManager } from '../../../incident.manager';
import { Vehicle } from "../Vehicle";

@Component({
    selector: 'preparednessUpdateModal-component',
    templateUrl: './preparednessUpdateModal.component.html'
})
export class UpdatePreparednessComponent implements OnInit {
    isHidden: boolean;
    @ViewChild('closeModal') closeUpdatePreparednessModal: ElementRef;
    @Input() preparedness: Preparedness;
    @Input() theSelectedStatus: Status;
    @Input() theSelectedEmergencyCode: EmergencyCode;
    @Input() theSelectedVehicle: Vehicle;

    constructor(private preparednessManager: PreparednessManager, private incidentManager: IncidentManager) {
    }

    ngOnInit(): void {
        this.isHidden = true;
    }

    btnOk(selectedCodeId: number, selectedStatusId: number) {

        if (selectedStatusId > 0) {
            this.preparedness.vehicle.status = new Status();
            this.preparedness.vehicle.status.id = selectedStatusId;
        }

        this.preparedness.incident = this.incidentManager.incident;
        this.preparedness.emergencyCode = new EmergencyCode();
        this.preparedness.emergencyCode.id = selectedCodeId;
        this.preparednessManager.updatePreparedness(this.preparedness);
        this.closeUpdatePreparednessModal.nativeElement.click();
    }
}
