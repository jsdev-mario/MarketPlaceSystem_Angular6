import { Injectable } from '@angular/core';
import API_URL from '../api_url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { StatusService } from '../status/status.service';

declare var require: any;
const store = require('store');

@Injectable()
export class SysAuthService {

    constructor(
        private http: HttpClient,
        public router: Router,
        public status_service: StatusService,
    ) { }

    custSignIn(param) {
        return this.http.post(API_URL.CUSTOMER_SIGNIN, param)
            .map((response) => <any>response)
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    custSignUp(param): Promise<any> {
        return this.http.post(API_URL.CUSTOMER_SIGNUP, param)
            .map((response) => <any>response)
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    butSignIn(param) {
        return this.http.post(API_URL.BUTHCER_SIGNIN, param)
            .map((response) => <any>response)
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    butSignUp(param): Promise<any> {
        return this.http.post(API_URL.BUTCHER_SIGNUP, param)
            .map((response) => <any>response)
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    logout() {
        store.remove('user');
        store.remove('token');
        if (this.status_service.logout_delay) {
            this.status_service.logout_delay = false;
            return;
        }
        this.router.navigate(['/']);
    }

    errorHandler(error) {
        if (error.status === 450) {
            this.logout();
        }
        throw (error);
    }

}
