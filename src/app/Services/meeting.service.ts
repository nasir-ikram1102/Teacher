import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class MeetingService {
    private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private _httpClient: HttpClient) { }

    get(url: string): Observable<any> {
        return this._httpClient.get(environment.apiUrl + url);
    }

    authenticate(body: any) {
        return this._httpClient.post(`${environment.apiUrl}meeting/login`, body);
    }

    createMeeting(body: any, token: string) {
        return this._httpClient.post(environment.apiUrl + 'meeting/create?token=' + token, body);
    }
}