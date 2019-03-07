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
export class CustomerService {

    constructor(
        private http: HttpClient,
        private auth_service: SysAuthService
    ) { }

    uploadFile(form_data): Promise<any> {
        const headers = new HttpHeaders({});
        headers.delete('Content-Type');
        return this.http.post(API_URL.UPLOAD_CUSTOMERFILE, form_data, { headers: headers })
            .map((response) => <string>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    updateProfile(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.CUSTOMER_UPDATE_PROFILE, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    forgotPassword(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(API_URL.CUSTOMER_FORGOTPASS, param, { headers: headers })
            .map((response) => <any>response['message'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    changePassword(new_password) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.CUSTOMER_CHANGEPASS, { new_password: new_password }, { headers: headers })
            .map((response) => <any>response['message'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    addDeliveryAddress(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.CUSTOMER_DELADDRESS_ADD, { address: param }, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    updateDeliveryAddress(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.CUSTOMER_DELADDRESS_UPDATE, { address: param }, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    removeDeliveryAddress(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.CUSTOMER_DELADDRESS_REMOVE, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    deleteAccount(password) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.CUSTOMER_DELETE_ACCOUNT, {password: password}, { headers: headers })
            .map((response) => <any>response['message'])
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
