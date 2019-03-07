import { Injectable } from '@angular/core';
import API_URL from '../api_url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import constant from '../constant';
const moment = require('moment');
declare var require: any;
const store = require('store');
import * as jsPDF from 'jspdf';


@Injectable()
export class CommonService {

    constructor(
        private http: HttpClient
    ) { }

    validatePostCode(post_code): Promise<any> {
        return this.http.get(API_URL.POSTCODE_VALIDATE_URL + post_code + '/validate')
            .map((response) => <any>response)
            .toPromise()
            .catch(error => {
                throw (error);
            });
    }

    getDataByPostCode(post_code): Promise<any> {
        return this.http.get(API_URL.POSTCODE_GETDATA_URL + post_code)
            .map((response) => <any>response)
            .toPromise()
            .catch(error => {
                throw (error);
            });
    }

    getNearestAddress(post_code): Promise<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(API_URL.LOCATION_NEAREST_ADDRESS, { post_code: post_code })
            .map((response) => <any>response)
            .toPromise()
            .catch(error => {
                throw (error);
            });
    }

    getAddressToLocation(param): Promise<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(API_URL.ADDRESS_TO_LOCATION, param)
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                throw (error);
            });
    }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        // console.log('value', lat2, lat1);
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        // console.log('result', dLat, lat2, lat1);
        return d;
    }

    private deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    /*** donw load csv and pdf */

    convertArrayOfObjectsToCSV(args) {
        let result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) {
                    result += columnDelimiter;
                }
                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    saveCSV(datas, file_name) {
        let data, link;
        let csv = this.convertArrayOfObjectsToCSV({
            data: datas
        });
        if (csv == null) {
            return;
        }
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', `${file_name}.csv`);
        link.click();
    }

    saveButcherPDF(datas, doc_title, file_name) {
        const x_datas = [13, 26, 45, 63, 95, 125, 155, 187, 207, 224, 241, 268];
        const line_x1_data = 10;
        const line_x2_data = 287;
        const doc = new jsPDF('landscape');
        doc.setFontSize(15);
        doc.setTextColor(255, 0, 0);
        doc.text(150, 20, doc_title, null, null, 'center');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(150, 25, `(${moment().format('ddd, MM-DD-YYYY')})`, null, null, 'center');
        let y_data = 40;
        if (datas.length > 0) {
            const headers = Object.keys(datas[0]);
            for (let keynum = 0; keynum < headers.length; keynum++) {
                if ( keynum === 5 || keynum === 8) {
                    doc.text(x_datas[keynum], y_data - 2.5, String(headers[keynum]).split(' ')[0], null, null, 'center');
                    doc.text(x_datas[keynum], y_data + 1.5, String(headers[keynum]).split(' ')[1], null, null, 'center');
                } else {
                    doc.text(x_datas[keynum], y_data, headers[keynum], null, null, 'center');
                }
            }
        } else {
            return;
        }
        doc.setLineWidth(0.5);
        doc.line(line_x1_data, y_data + 3, line_x2_data, y_data + 3);
        y_data += 10;
        doc.setLineWidth(0.2);
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(100, 100, 100);
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            const keys = Object.keys(data);
            for (let j = 0; j < keys.length; j++) {
                if (j === 6) {
                    doc.text(x_datas[j], y_data - 2.5, String(data[keys[j]]).split('(')[0], null, null, 'center');
                    doc.text(x_datas[j], y_data + 1.5, String(data[keys[j]]).split('(')[1].slice(0, -1), null, null, 'center');
                } else {
                    doc.text(x_datas[j], y_data, String(data[keys[j]]), null, null, 'center');
                }
            }
            doc.line(line_x1_data, y_data + 3, line_x2_data, y_data + 3);
            y_data += 10;
            if ((i + 1) % 15 === 0) {
                doc.addPage();
                doc.setFontSize(15);
                doc.setTextColor(255, 0, 0);
                doc.text(150, 20, doc_title, null, null, 'center');
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(150, 25, `(${moment().format('ddd, MM-DD-YYYY')})`, null, null, 'center');
                y_data = 40;
                const headers = Object.keys(datas[0]);
                for (let keynum = 0; keynum < headers.length; keynum++) {
                    if ( keynum === 5 || keynum === 8) {
                        doc.text(x_datas[keynum], y_data - 2.5, String(headers[keynum]).split(' ')[0], null, null, 'center');
                        doc.text(x_datas[keynum], y_data + 1.5, String(headers[keynum]).split(' ')[1], null, null, 'center');
                    } else {
                        doc.text(x_datas[keynum], y_data, headers[keynum], null, null, 'center');
                    }
                }
                doc.setLineWidth(0.5);
                doc.line(line_x1_data, y_data + 3, line_x2_data, y_data + 3);
                y_data += 10;
                doc.setLineWidth(0.2);
                doc.setTextColor(0, 0, 0);
                doc.setDrawColor(100, 100, 100);
            }
        }
        doc.save(`${file_name}.pdf`);
    }

    saveCustomerPDF(datas, doc_title, file_name) {
        const x_datas = [13, 26, 45, 63, 95, 126, 140, 168, 198, 214, 230, 245, 268];
        const line_x1_data = 10;
        const line_x2_data = 287;
        const doc = new jsPDF('landscape');
        doc.setFontSize(15);
        doc.setTextColor(255, 0, 0);
        doc.text(150, 20, doc_title, null, null, 'center');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(150, 25, `(${moment().format('ddd, MM-DD-YYYY')})`, null, null, 'center');
        let y_data = 40;
        if (datas.length > 0) {
            const headers = Object.keys(datas[0]);
            for (let keynum = 0; keynum < headers.length; keynum++) {
                if ( keynum === 4 || keynum === 5 || keynum === 6 || keynum === 9) {
                    doc.text(x_datas[keynum], y_data - 2.5, String(headers[keynum]).split(' ')[0], null, null, 'center');
                    doc.text(x_datas[keynum], y_data + 1.5, String(headers[keynum]).split(' ')[1], null, null, 'center');
                } else {
                    doc.text(x_datas[keynum], y_data, headers[keynum], null, null, 'center');
                }
            }
        } else {
            return;
        }
        doc.setLineWidth(0.5);
        doc.line(line_x1_data, y_data + 3, line_x2_data, y_data + 3);
        y_data += 10;
        doc.setLineWidth(0.2);
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(100, 100, 100);
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            const keys = Object.keys(data);
            for (let j = 0; j < keys.length; j++) {
                if (j === 7) {
                    doc.text(x_datas[j], y_data - 2.5, String(data[keys[j]]).split('(')[0], null, null, 'center');
                    doc.text(x_datas[j], y_data + 1.5, String(data[keys[j]]).split('(')[1].slice(0, -1), null, null, 'center');
                } else {
                    doc.text(x_datas[j], y_data, String(data[keys[j]]), null, null, 'center');
                }
            }
            doc.line(line_x1_data, y_data + 3, line_x2_data, y_data + 3);
            y_data += 10;
            if ((i + 1) % 15 === 0) {
                doc.addPage();
                doc.setFontSize(15);
                doc.setTextColor(255, 0, 0);
                doc.text(150, 20, doc_title, null, null, 'center');
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(150, 25, `(${moment().format('ddd, MM-DD-YYYY')})`, null, null, 'center');
                y_data = 40;
                const headers = Object.keys(datas[0]);
                for (let keynum = 0; keynum < headers.length; keynum++) {
                    if ( keynum === 4 || keynum === 5 || keynum === 6 || keynum === 9) {
                        doc.text(x_datas[keynum], y_data - 2.5, String(headers[keynum]).split(' ')[0], null, null, 'center');
                        doc.text(x_datas[keynum], y_data + 1.5, String(headers[keynum]).split(' ')[1], null, null, 'center');
                    } else {
                        doc.text(x_datas[keynum], y_data, headers[keynum], null, null, 'center');
                    }
                }
                doc.setLineWidth(0.5);
                doc.line(line_x1_data, y_data + 3, line_x2_data, y_data + 3);
                y_data += 10;
                doc.setLineWidth(0.2);
                doc.setTextColor(0, 0, 0);
                doc.setDrawColor(100, 100, 100);
            }
        }
        doc.save(`${file_name}.pdf`);
    }
}
