var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr-client';
import { SignalRConstant } from './signalRConstant';

var SignalRService = (function () {
    function SignalRService() {
        this.preparednessAdded = new EventEmitter();
        this.journalAdded = new EventEmitter();
        this.incidentChanged = new EventEmitter();
        this.clearFieldsAndBtnsAfterRemovedIncident = new EventEmitter();
        this.newCpuValue = new EventEmitter();
        this.connectionEstablished = new EventEmitter();
        this.connectionExists = false;
        this._hubConnection = new HubConnection(SignalRConstant.serverUrl + 'message');
        this.registerOnServerEvents();
        this.startConnection();
    }

    SignalRService.prototype.startConnection = function () {
        var _this = this;
        this._hubConnection.start()
            .then(function () {
                console.log('Hub connection started');
                _this.connectionEstablished.emit(true);
            })
            .catch(function (err) {
                console.log('Error while establishing connection');
            });
    };
    SignalRService.prototype.registerOnServerEvents = function () {
        var _this = this;
        this._hubConnection.on('IncidentAdded', function (data) {
            _this.incidentChanged.emit(data);
        });
        this._hubConnection.on('IncidentUpdated', function (data) {
            _this.incidentChanged.emit(data);
        });
        this._hubConnection.on('IncidentClosed', function (data) {
            _this.incidentChanged.emit(data);
        });
        this._hubConnection.on('JournalAdded', function (data) {
            _this.journalAdded.emit(data);
        });
        this._hubConnection.on('JournalUpdated', function (data) {
            _this.journalAdded.emit(data);
        });
        this._hubConnection.on('PreparednessAdded', function (data) {
            _this.preparednessAdded.emit(data);
        })
        this._hubConnection.on('PreparednessUpdated', function (data) {
            _this.preparednessAdded.emit(data);
        })
        this._hubConnection.on('PreparednessRemoved', function (data) {
            _this.preparednessAdded.emit(data);
        })
        this._hubConnection.on('PreparednessAllocation', function (data) {
            _this.preparednessAdded.emit(data);
        })
        this._hubConnection.on('ClearAllAfterClose', function (data) {
            _this.clearFieldsAndBtnsAfterRemovedIncident.emit(data);
        })
        
        //this._hubConnection.on('LoggerAdded', function (data) {
        //    _this.loggerChanged.emit(data);
        //});
        //this._hubConnection.on('FoodDeleted', function (data) {
        //    _this.foodchanged.emit('this could be data');
        //});
        //this._hubConnection.on('FoodUpdated', function (data) {
        //    _this.foodchanged.emit('this could be data');
        //});
        //this._hubConnection.on('Send', function (data) {
        //    var recieved = "Recieved: " + data;
        //    console.log(recieved);
        //    _this.messageReceived.emit(data);
        //});
        //this._hubConnection.on('newCpuValue', function (data) {
        //    _this.newCpuValue.emit(data);
        //});
    };
    SignalRService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], SignalRService);
    return SignalRService;
}());
export { SignalRService };
//# sourceMappingURL=signalRService.js.map