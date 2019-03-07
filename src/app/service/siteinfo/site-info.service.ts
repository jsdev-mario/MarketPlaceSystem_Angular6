import { Injectable } from '@angular/core';
import API_URL from '../api_url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


@Injectable()
export class SiteInfoService {

  constructor(
    public http: HttpClient,
  ) { }

  getSiteInfo(): Promise<any> {
    return this.http.post(API_URL.SITE_INFO_GET, {})
      .map((response) => {
        return <any>response['data'];
      }).toPromise()
      .catch(error => {
        throw (error);
      });
  }
}
