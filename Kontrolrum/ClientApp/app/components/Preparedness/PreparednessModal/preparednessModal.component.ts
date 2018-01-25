import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Preparedness } from '../preparedness';
import { Vehicle } from '../Vehicle';
import { Types } from '../Types';
import { EmergencyCode } from "../EmergencyCode";
import { Incident } from "../../incident/Incident";
import { PreparednessManager } from '../../../preparedness.manager';
import { IncidentManager } from "../../../incident.manager";
import { JournalManager } from "../../../journal.manager";
import { Status } from "../Status";
import { Reception } from "../Reception";
declare var swal: any;

@Component({
    selector: 'preparednessModal-component',
    templateUrl: './preparednessModal.component.html',
    exportAs: "child"
})

export class PreparednessModalComponent implements OnInit {
    setClickedRow: Function;
    setClickedRow1: Function;
    setClickedRow2: Function;
    selectedType: Types;
    selectedCode: EmergencyCode;
    selectedVehicle: Vehicle;
    isHidden: boolean;
    selectedStatus: Status;
    @ViewChild('closeModal') closeAddPreparednessModal: ElementRef;

    constructor(private preparednessManager: PreparednessManager, private incidentManager: IncidentManager,
        private journalManager: JournalManager) {
    }

    ngOnInit(): void {
        this.isHidden = true;
        //Mark the selected rows
        //this.setClickedRow = function (index: number) {
        //    this.selectedRow = index;
        //}
        //this.setClickedRow1 = function (index: number) {
        //    this.selectedRow1 = index;
        //}
        //this.setClickedRow2 = function (index: number) {
        //    this.selectedRow2 = index;
        //}

        this.preparednessManager.getAllVehicleTypes();
        this.preparednessManager.getAllEmergencyCodes();
        this.preparednessManager.getAllStatuses();
    }

    theSelectedType(type: Types) {
        this.preparednessManager.vehicleList = [];
        this.preparednessManager.getAllVehiclesByTypeId(type.id);
    }

    btnOk() {
        if (this.selectedVehicle == null || this.selectedCode == null) {
            this.isHidden = false;
        }
        else {
            var preparedness = {
                reception: new Reception(), incident: new Incident(), emergencyCode: new EmergencyCode(), vehicle: new Vehicle()
            };

            this.preparednessManager.vehicle = this.selectedVehicle;
            this.preparednessManager.emergencyCode = this.selectedCode;
            this.preparednessManager.status = this.selectedStatus;

            preparedness.vehicle.status = new Status();

            if (this.selectedStatus != null) {

                preparedness.vehicle.status.id = this.selectedStatus.id;
            }
            else {
                preparedness.vehicle.status == null;
            }

            if (this.preparednessManager.preparednesslist.length != 0) {
                for (var item of this.preparednessManager.preparednesslist) {
                    //Selectecvehicle, code, maybe status to null to work
                    if (this.selectedVehicle.id != item.vehicle.id) {
                        if (this.selectedVehicle.status.id > 3) {
                            this.reallocationMessage(preparedness);
                        }
                        else {
                            preparedness.incident.id = this.incidentManager.incidentId;
                            preparedness.emergencyCode.id = this.selectedCode.id;
                            preparedness.vehicle.id = this.selectedVehicle.id;
                            preparedness.incident = this.incidentManager.incident;
                            this.preparednessManager.createPreparedness(preparedness);

                            this.isHidden = true;

                            this.preparednessManager.vehicletypeList = [];
                            this.preparednessManager.getAllVehicleTypes();

                            this.preparednessManager.ecodeList = [];
                            this.preparednessManager.getAllEmergencyCodes();

                            this.preparednessManager.statusList = [];
                            this.preparednessManager.getAllStatuses();

                            //Set objects to null
                            delete this.selectedType;
                            delete this.selectedVehicle;
                            delete this.selectedCode;
                            delete this.selectedStatus;

                            this.closeAddPreparednessModal.nativeElement.click();
                        }
                    }


                    else {
                        swal({
                            title: "Advarsel!",
                            text: "Denne vogn er allerede knyttet til denne hændelse",
                            type: "warning",
                            confirmButtonColor: '#5cb85c'
                        });
                    }
                }
            }

            else if (this.selectedVehicle.status.id > 3) {
                this.reallocationMessage(preparedness);

               
            }

            //Hvis vi skal fikse bug med ledig vogn, så er det her
            else {
                preparedness.incident.id = this.incidentManager.incidentId;
                preparedness.emergencyCode.id = this.selectedCode.id;
                preparedness.vehicle.id = this.selectedVehicle.id;
                preparedness.incident = this.incidentManager.incident;
                this.preparednessManager.createPreparedness(preparedness);

                this.isHidden = true;

                this.preparednessManager.vehicletypeList = [];
                this.preparednessManager.getAllVehicleTypes();

                this.preparednessManager.ecodeList = [];
                this.preparednessManager.getAllEmergencyCodes();

                this.preparednessManager.statusList = [];
                this.preparednessManager.getAllStatuses();

                //Set objects to null
                delete this.selectedType;
                delete this.selectedVehicle;
                delete this.selectedCode;
                delete this.selectedStatus;

                this.closeAddPreparednessModal.nativeElement.click();
            }
        }
    }

    btnCancel() {

        this.isHidden = true;

        this.preparednessManager.vehicletypeList = [];
        this.preparednessManager.getAllVehicleTypes();

        this.preparednessManager.vehicleList = [];
        this.preparednessManager.getAllVehicles();

        this.preparednessManager.ecodeList = [];
        this.preparednessManager.getAllEmergencyCodes();

        this.preparednessManager.statusList = [];
        this.preparednessManager.getAllStatuses();

        this.closeAddPreparednessModal.nativeElement.click();
    }

    reallocationMessage(preparedness: any) {
        var self = this;
        swal({
            title: "Advarsel!",
            text: "Vil du omdisponere denne vogn til valgte hændelse?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#5cb85c',
            cancelButtonColor: '#f0ad4e',
            confirmButtonText: 'Omdisponer',
            cancelButtonText: "Annuller",
            allowOutsideClick: false,
        }).then(
            function () {
                if (confirm) {
                    preparedness.incident.id = self.incidentManager.incidentId;
                    preparedness.emergencyCode.id = self.selectedCode.id;
                    preparedness.vehicle.id = self.selectedVehicle.id;
                    preparedness.incident = self.incidentManager.incident;
                    self.preparednessManager.createAllocation(preparedness);

                    //Set objects to null
                    delete self.selectedType;
                    delete self.selectedVehicle;
                    delete self.selectedCode;
                    delete self.selectedStatus;

                    self.closeAddPreparednessModal.nativeElement.click();
                    //swal({
                    //    title: "Hændelse er lukket",
                    //    type: "success",
                    //    showCancelButton: false,
                    //    showConfirmButton: false,
                    //    allowOutsideClick: false,
                    //    timer: 2000,
                    //}
                    //)
                }
            });
    }
}













