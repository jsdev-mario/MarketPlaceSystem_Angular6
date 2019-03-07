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
export class StocklistService {

    selected_offer_category: any;
    selected_offer_subcategory: any;
    selected_offer_subcategories: any[] = [];

    selected_category: any;
    selected_subcategory: any;
    selected_choice1: any;
    selected_choice2: any;
    selected_choice3: any;
    selected_choice4: any;

    categories: any[] = [];
    subcategories: any = {};
    choices: any = {};

    selected_subcategories: any[] = [];
    selected_choices1: any[] = [];
    selected_choices2: any[] = [];
    selected_choices3: any[] = [];
    selected_choices4: any[] = [];


    constructor(
        public auth_service: SysAuthService,
        private http: HttpClient,
        public router: Router
    ) { }

    init() {
        this.categories = [];
        this.subcategories = {};
        this.choices = {};
        this.selected_subcategories = [];
        this.selected_choices1 = [];
        this.selected_choices2 = [];
        this.selected_choices3 = [];
        this.selected_choices4 = [];
        this.selected_category = undefined;
        this.selected_subcategory = undefined;
        this.selected_choice1 = undefined;
        this.selected_choice2 = undefined;
        this.selected_choice3 = undefined;
        this.selected_choice4 = undefined;

    }

    nameCompare(a: any, b: any) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        return 0;
    }

    /*** sort for category */
    sort() {
        if (this.categories) {
            this.categories.sort(this.nameCompare);
        }
        if (this.selected_subcategories) {
            this.selected_subcategories.sort(this.nameCompare);
        }
        if (this.selected_choices1) {
            this.selected_choices1.sort(this.nameCompare);
        }
        if (this.selected_choices2) {
            this.selected_choices2.sort(this.nameCompare);
        }
        if (this.selected_choice3) {
            this.selected_choices3.sort(this.nameCompare);
        }
        if (this.selected_choices4) {
            this.selected_choices4.sort(this.nameCompare);
        }
    }

    getSubCategories() {
        if (this.selected_category) {
            this.selected_subcategories = [];
            this.selected_choices1 = [];
            this.selected_choices2 = [];
            this.selected_choices3 = [];
            this.selected_choices4 = [];
            console.log(this.subcategories);
            this.selected_subcategories = this.subcategories[this.selected_category._id];
            console.log(this.selected_subcategories);
        }
        return [];
    }

    saveMenu(param): Promise<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.SHOP_MENU_UPDATE, param, { headers: headers })
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
