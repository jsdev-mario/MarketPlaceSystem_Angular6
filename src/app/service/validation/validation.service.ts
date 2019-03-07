import { Injectable } from '@angular/core';
import API_URL from '../api_url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
declare var require: any;
const store = require('store');

@Injectable()
export class ValidationService {

    constructor(
        private http: HttpClient,
    ) { }

    textInputValidate(value) {
        switch (this.textValueValidate(value)) {
            case -1:
                return 'mt-input';
            case 0:
                return 'mt-danger-input';
            case 1:
                return 'mt-success-input';
        }
    }

    textInputOptionalValidate(value) {
        switch (this.textValueValidate(value)) {
            case -1:
                return 'mt-input';
            case 0:
                return 'mt-input';
            case 1:
                return 'mt-success-input';
        }
    }

    textAreaValidate(value) {
        switch (this.textValueValidate(value)) {
            case -1:
                return 'mt-textarea';
            case 0:
                return 'mt-textarea';
            case 1:
                return 'mt-success-textarea';
        }
    }

    textValueValidate(value) {
        if (value === undefined) {
            return -1;
        } else if (value === '' || value === ' ') {
            return 0;
        } else {
            return 1;
        }
    }

    emailValidate(val) {
        const value = val.trim();
        const re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        if (value === undefined || value === '' || !re.test(value)) {
            return false;
        }
        return true;
    }

    postCodeValidate(val) {
        const value = val.trim();
        if (value === undefined || value === '' || value.length > 8) {
            console.log(0);
            return false;
        }
        if (value.indexOf(' ') === -1) {
            console.log(1);
            return false;
        }
        const postcode_values = value.split(' ');
        if (postcode_values.length !== 2) {
            console.log(2);
            return false;
        }
        if (postcode_values[1].length !== 3) {
            console.log(3);
            return false;
        }
        if (!this.isNumber(postcode_values[1].charAt(0))) {
            console.log(Number(postcode_values[1].charAt(0)));
            return false;
        }
        if (this.isNumber(postcode_values[1].charAt(1))) {
            console.log(5);
            return false;
        }
        if (this.isNumber(postcode_values[1].charAt(2))) {
            console.log(6);
            return false;
        }
        return true;
    }

   passwordValidate(pass) {
        for (let i = 0; i < pass.length; i++) {
            if (this.isNumber(pass[i])) {
                return true;
            }
        }
        return false;
    }

    isNumber(string) {
        return !isNaN(parseFloat(string)) && isFinite(string);
    }

}

