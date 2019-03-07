import { Injectable } from '@angular/core';
import API_URL from '../api_url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { SysAuthService } from '..';
declare var require: any;
const store = require('store');

@Injectable()
export class ButcherService {

    constructor(
        private http: HttpClient,
        private auth_service: SysAuthService
    ) { }

    updateProfile(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.BUTCHER_UPDATE_PROFILE, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    uploadFile(form_data): Promise<any> {
        const headers = new HttpHeaders({});
        headers.delete('Content-Type');
        return this.http.post(API_URL.UPLOAD_BUTCHERFILE, form_data, { headers: headers })
            .map((response) => <string>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    updateShop(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.SHOP_UPDATE, param, { headers: headers })
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
        return this.http.post(API_URL.BUTCHER_FORGOTPASS, param, { headers: headers })
            .map((response) => <any>response['message'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    changePassword(new_password): Promise<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.BUTCHER_CHANGEPASS, { new_password: new_password }, { headers: headers })
            .map((response) => <any>response['message'])
            .toPromise()
            .catch(error => {
                this.errorHandler (error);
            });
    }

    updateShopMenu(param): Promise<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.BUTHCER_SHOPMENU_UPDATE, param, { headers: headers })
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
