
import { Component, OnInit } from '@angular/core';
import { IncidentManager } from "../../incident.manager";
import { LoggerManager } from "../../logger.manager";
import { PreparednessManager } from "../../preparedness.manager";

@Component({
    selector: 'Logger-component',
    templateUrl: './Logger.component.html'
})
export class LoggerComponent implements OnInit {
    isDisabled: boolean;
   
    constructor(private incidentManager: IncidentManager, private loggerManager: LoggerManager, private preparednessManager: PreparednessManager) {   
        
    }

    ngOnInit(): void {
        this.incidentManager.subscribeToEvents();
    }
}
