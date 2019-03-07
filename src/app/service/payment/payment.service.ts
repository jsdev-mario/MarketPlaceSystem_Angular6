import { Injectable } from '@angular/core';
import API_URL from '../api_url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { SysAuthService } from '..';
declare var require: any;
const store = require('store');

@Injectable()
export class PaymentService {

    constructor(
        public auth_service: SysAuthService,
        private http: HttpClient,
        private router: Router
    ) { }

    getAccessToken() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(API_URL.PAYMENT_GETACCESS_TOKEN, {}, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    getClientToken() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.PAYMENT_GET_CLIENT_TOKEN, {}, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    checkOutPaypal(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.PAYMENT_CHECK_OUT_PAYPAL, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    checkOutCard(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.PAYMENT_CHECK_OUT_CARD, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    errorHandler(error) {
        if (error.status === 450) {
            this.auth_service.logout();
        }
        throw (error);
    }

}
