import { Injectable, Inject } from '@angular/core';
import { Logger } from "./components/Logger/Logger";
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from "rxjs/Rx";
//import { CONFIGURATION } from '../app/app.constants';


@Injectable()
export class LoggerProxy {
    private loggerUrl = this.proxy + 'api/logger/';

    constructor(private http: Http, @Inject('PROXY_URL') private proxy: any) {
    }

    getAllLoggersByIncidentId = (incidentId: any): Observable<Logger[]> => {
        return this.http.get(this.loggerUrl + incidentId, incidentId)
            .map((response: Response) => <Logger[]>response.json())
            .catch(this.handleError);
    }

    //This is for the error handling
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        //alert("Der er opstået en fejl");
        return Promise.reject(error.message || error);
    }

}
