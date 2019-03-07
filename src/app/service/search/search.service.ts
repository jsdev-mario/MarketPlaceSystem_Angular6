import { Injectable } from '@angular/core';
import API_URL from '../api_url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class SearchService {

    post_code = '';
    location: any;
    shop_name = '';
    meat_type = 0;
    sort_item = 0;

    butchers: any[] = [];

    constructor(
        private http: HttpClient
    ) { }

    search(): Promise<any[]> {
        return this.http.post(API_URL.BUTCHER_SEARCH, {})
            .map((response) => <any[]>response['data'])
            .toPromise()
            .catch(error => {
                throw (error);
            });
    }
}
