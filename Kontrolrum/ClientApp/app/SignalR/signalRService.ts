import { EventEmitter, Injectable, Inject } from '@angular/core';
import { HubConnection } from '@aspnet/signalr-client';

@Injectable()
export class SignalRService {

    preparednessAdded = new EventEmitter();
    journalAdded = new EventEmitter();
    incidentChanged = new EventEmitter();
    clearFieldsAndBtnsAfterRemovedIncident = new EventEmitter();
    connectionExists = false;
    messageReceived = new EventEmitter<string>();
    connectionEstablished = new EventEmitter<Boolean>();
    private _hubConnection: HubConnection;

    constructor( @Inject('PROXY_URL') private proxy: any) {
        this._hubConnection = new HubConnection(proxy + 'message');

        this.registerOnServerEvents();

        this.startConnection();
    }

    private startConnection(): void {

        this._hubConnection.start()
            .then(() => {
                console.log('Hub connection started');
                this.connectionEstablished.emit(true);
            })
            .catch(err => {
                console.log('Error while establishing connection')
            });
    }

    private registerOnServerEvents(): void {
        this._hubConnection.on('IncidentAdded', (data: any) => {
            this.incidentChanged.emit(data);
        });
        this._hubConnection.on('IncidentUpdated', (data: any) => {
            this.incidentChanged.emit(data);
        });
        this._hubConnection.on('IncidentClosed', (data: any) => {
            this.incidentChanged.emit(data);
        });
        this._hubConnection.on('JournalAdded', (data: any) => {
            this.journalAdded.emit(data);
        })
        this._hubConnection.on('JournalUpdated', (data: any) => {
            this.journalAdded.emit(data);
        })
        this._hubConnection.on('PreparednessAdded', (data: any) => {
            this.preparednessAdded.emit(data);
        })
        this._hubConnection.on('PreparednessUpdated', (data: any) => {
            this.preparednessAdded.emit(data);
        })
        this._hubConnection.on('PreparednessRemoved', (data: any) => {
            this.preparednessAdded.emit(data);
        })
        this._hubConnection.on('PreparednessAllocation', (data: any) => {
            this.preparednessAdded.emit(data);
        })
        this._hubConnection.on('ClearAllAfterClose', (data: any) => {
            this.clearFieldsAndBtnsAfterRemovedIncident.emit(data);
        })
    }
}
