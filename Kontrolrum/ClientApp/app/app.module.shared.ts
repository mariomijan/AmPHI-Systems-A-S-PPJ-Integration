import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { IncidentComponent } from './components/incident/incident.component';
import { IncidentHistoryComponent } from './components/incidentHistory/incidentHistory.component';
import { JournalComponent } from './components/Journal/journal.component';
import { JournalModalComponent } from './components/Journal/JournalModal/journalModal.component';
import { PreparednessComponent } from './components/Preparedness/preparedness.component';
import { PreparednessModalComponent } from './components/Preparedness/PreparednessModal/preparednessModal.component';
import { IncidentManager } from "./incident.manager";
import { IncidentProxy } from "./incident.proxy";
import { JournalProxy } from "./journal.proxy";
import { JournalManager } from './journal.manager';
import { PreparednessManager } from './preparedness.manager';
import { PreparednessProxy } from './preparedness.proxy';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UpdateJournalComponent } from './components/Journal/JournalUpdateModal/journalUpdateModal.component';
import { UpdatePreparednessComponent } from './components/Preparedness/PreparednessUpdateModal/preparednessUpdateModal.component';
import { InactiveHistoryComponent } from './components/incidentHistory/InactiveHistoryModal/InactiveHistory.component';
import { LoggerComponent } from './components/Logger/Logger.component';
import { LoggerManager } from './logger.manager';
import { LoggerProxy } from './logger.proxy';
import { SignalRService } from './SignalR/signalRService';
import { AdminComponent } from './Admin/components/Admin/Admin.component';


@NgModule({
    declarations: [
        AppComponent,
        IncidentComponent,
        IncidentHistoryComponent,
        JournalComponent,
        JournalModalComponent,
        PreparednessComponent,
        PreparednessModalComponent,
        UpdateJournalComponent,
        UpdatePreparednessComponent,
        InactiveHistoryComponent,
        LoggerComponent,
        AdminComponent
        
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: '**', redirectTo: 'home' }
        ]),
        
    ],
    bootstrap: [AppComponent],
    providers: [IncidentManager, IncidentProxy, JournalManager, JournalProxy, PreparednessManager, PreparednessProxy, LoggerManager, LoggerProxy, SignalRService]
}) 
export class AppModuleShared {
}
