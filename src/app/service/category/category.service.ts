import { Injectable } from '@angular/core';
import API_URL from '../api_url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
declare var require: any;
const store = require('store');

@Injectable()
export class CategoryService {

    selected_category: any;
    selected_subcategory: any;
    selected_choice1: any;
    selected_choice2: any;
    selected_choice3: any;
    selected_choice4: any;

    categories: any[];
    selected_subcategories: any[] = [];
    selected_choices1: any[] = [];
    selected_choices2: any[] = [];
    selected_choices3: any[] = [];
    selected_choices4: any[] = [];

    constructor(
        private http: HttpClient,
    ) { }

    init() {
        this.categories = [];
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

    /** Category get */
    getCategory(): Promise<any[]> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'token': store.get('token')
        });
        return this.http.post(API_URL.CATEGORY_GET, {}, { headers: headers })
            .map((response) => <any[]>response['data'])
            .toPromise()
            .catch(error => {
                throw (error);
            });
    }
    /** Subcategory get */
    getSubcategory(category_id): Promise<any[]> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'token': store.get('token')
        });
        return this.http.post(API_URL.SUBCATEGORY_GET, { category_id: category_id }, { headers: headers })
            .map((response) => <any[]>response['data'])
            .toPromise()
            .catch(error => {
                throw (error);
            });
    }

    /** Choice get */
    getChoice(subcategory_id): Promise<any[]> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'token': store.get('token')
        });
        return this.http.post(API_URL.CHOICE_GET, { subcategory_id: subcategory_id }, { headers: headers })
            .map((response) => <any[]>response['data'])
            .toPromise()
            .catch(error => {
                throw (error);
            });
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
        this.categories.sort(this.nameCompare);
        this.selected_subcategories.sort(this.nameCompare);
        this.selected_choices1.sort(this.nameCompare);
        this.selected_choices2.sort(this.nameCompare);
        this.selected_choices3.sort(this.nameCompare);
        this.selected_choices4.sort(this.nameCompare);
    }
}
