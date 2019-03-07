import { Injectable } from '@angular/core';
import API_URL from '../api_url';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { SysAuthService } from '..';
declare var require: any;
const store = require('store');

@Injectable()
export class ContactService {

    constructor(
        private http: HttpClient,
        private auth_service: SysAuthService
    ) { }

    add(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(API_URL.CONTACTUS_ADD, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    errorHandler(error) {
        if (error.status === 450) {
            this.auth_service.logout();
        }
        throw (error);
    }

}
