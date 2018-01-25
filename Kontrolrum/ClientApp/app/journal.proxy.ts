import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Journal } from './components/Journal/Journal';
import { Observable } from "rxjs/Rx";
import 'rxjs/Rx';
//import { CONFIGURATION } from '../app/app.constants';


@Injectable()
export class JournalProxy {
    private journalUrl = this.proxy + 'api/journal/';
    private getJournalUrl = this.proxy + 'api/journal?=';
    private getInActiveJournalsUrl = this.proxy + 'api/journal/GetAllInActiveJournalsByIncidentId?=';

    constructor(private http: Http, @Inject('PROXY_URL') private proxy: any) {
    }

    //We call this method on the WEB-api
    createJournal = (journal: any): Observable<Journal> => {
    return this.http.post(this.journalUrl, journal)
        .map((response: Response) => <Journal>response.json())
        .catch(this.handleError);
    }

    getJournal(journalId: any): Promise<Journal> {
        return this.http.get(this.getJournalUrl + journalId, journalId).toPromise()
            .then(response => response.json() as Journal).catch(this.handleError);
    }

    //We call this method on the WEB-api
    //getAllJournals(): Promise<Journal[]> {
    //    return this.http.get(this.journalUrl).toPromise()
    //        .then(response => response.json() as Journal[])
    //        .catch(this.handleError);
    //}

    //We call this method on the WEB-api
    getAllActiveJournalsByIncidentId = (incidentId: any): Observable<Journal[]> => {
        return this.http.get(this.journalUrl + incidentId, incidentId)
            .map((response: Response) => <Journal[]>response.json())
            .catch(this.handleError);
    }

    getAllInActiveJournalsByIncidentId = (incidentId: any): Observable<Journal[]> => {
        return this.http.get(this.getInActiveJournalsUrl + incidentId, incidentId)
            .map((response: Response) => <Journal[]>response.json())
            .catch(this.handleError);
    }

    //We call this method on the WEB-api
    removeJournal(journalId: any) {
        this.http.delete(this.journalUrl + journalId, journalId).toPromise();
    }

    //This is for the error handling
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        //alert("Der er opstået en fejl");
        return Promise.reject(error.message || error);
    }

    //We call this method on the WEB-api
    updateJournal = (journal: any): Observable<Journal> => {
    return this.http.put(this.journalUrl, journal)
        .map((response: Response) => <Journal>response.json())
            .catch(this.handleError);
    }
}