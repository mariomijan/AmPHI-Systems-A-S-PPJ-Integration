import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Incident } from './components/incident/Incident'
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';
import { Observable } from "rxjs/Rx";
import { SignalRConstant } from '../../ClientApp/app/SignalR/signalRConstant';

@Injectable()
export class IncidentProxy {
    private incidentUrl = this.proxy + 'api/incident/';
    private getInactiveIncidentUrl = this.proxy + 'api/incident/GetAllInActiveIncidents';
    private checkIAmAliveUrl = this.proxy + 'api/incident/CheckIAmAlive';

    constructor(private http: Http, @Inject('PROXY_URL') private proxy: any) {
        SignalRConstant.serverUrl = proxy;
    }

    checkIAmAlive(): Promise<string> {
        return this.http.get(this.checkIAmAliveUrl).toPromise()
            .then(Response => Response.text() as string)
            .catch(this.handleError);
    }

    //We call this method on the WEB-api
    saveIncident = (incident: Incident): Observable<Incident> => {
        return this.http.post(this.incidentUrl, incident)
            .map((response: Response) => <Incident>response.json())
            .catch(this.handleError);
    }

    //We call this method on the WEB-api
    updateIncident(incident: Incident) {
        return this.http.put(this.incidentUrl, incident).toPromise()
            .then(response => response.json() as Incident)
            .catch(this.handleError);
    }

    //We call this method on the WEB-api
    getAllActiveIncidents = (): Observable<Incident[]> => {
        return this.http.get(this.incidentUrl)
            .map((response: Response) => <Incident[]>response.json())
            .catch(this.handleError);
    }


    //We call this method on the WEB-api
    getIncident(id: any): Promise<Incident> {
        return this.http.get(this.incidentUrl + id, id).toPromise()
            .then(response => response.json() as Incident).catch(this.handleError);
    }

    GetAllInActiveIncidents(): Promise<Incident[]> {
        return this.http.get(this.getInactiveIncidentUrl).toPromise()
            .then(Response => Response.json() as Incident[])
            .catch(this.handleError);
    }

    closeIncident = (incident: Incident): Observable<Incident> => {
        return this.http.put(this.incidentUrl + incident, incident)
            .map((response: Response) => <Incident>response.json())
            .catch(this.handleError); 
    }

    //This is for the error handling
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        //alert("Der er opstået en fejl");
        return Promise.reject(error.message || error);
    }
}