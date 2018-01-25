
import { Component, OnInit } from '@angular/core';
import { Incident } from '..//..//incident/incident';
import { IncidentManager } from '..//..//..//incident.manager';
import { IncidentProxy } from '..//..//..//incident.proxy';


@Component({
    selector: 'Inactivehistory-component',
    templateUrl: './InactiveHistory.component.html'
})
export class InactiveHistoryComponent implements OnInit {
    ngOnInit(): void {
    }
    constructor(private incidentService: IncidentProxy, private incidentManager: IncidentManager) {

    }


}
