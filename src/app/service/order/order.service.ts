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
export class OrderService {

    current_order: any;

    constructor(
        private http: HttpClient,
        private auth_service: SysAuthService
    ) { }

    calOrderItemPrice(orderitem) {
        let sub_price = 0.0;
        if (orderitem.product.offer) {
            sub_price = Math.floor(orderitem.count / orderitem.product.offer.qty) * orderitem.product.offer.price;
            sub_price += orderitem.count % orderitem.product.offer.qty * orderitem.product.price;
            if (Math.floor(orderitem.count / orderitem.product.offer.qty) > 0) {
                orderitem.has_save = true;
                orderitem.save_price = (orderitem.count * orderitem.product.price) - sub_price;
            } else {
                orderitem.has_save = false;
            }
        } else {
            sub_price = orderitem.count * orderitem.product.price;
        }
        let choice_price = 0.0;
        orderitem.choices.forEach(element => {
            choice_price += element.price * orderitem.count;
        });
        orderitem.sub_price = sub_price + choice_price;
    }

    getSubTotalPrice() {
        if (this.current_order === undefined) {
            return 0.0;
        }
        let subtotal = 0.0;
        this.current_order.save_price = 0.0;
        this.current_order.offer_orderitems = [];
        this.current_order.order_items.forEach(element => {
            this.calOrderItemPrice(element);
            subtotal += element.sub_price;
            if (element.has_save) {
                this.current_order.offer_orderitems.push(element);
                this.current_order.save_price += element.save_price;
            }
        });
        return subtotal;
    }

    getTotalPrice() {
        let total_price = this.getSubTotalPrice();
        const site_info = store.get('site_info');
        if (this.current_order.delivery_option === 1) {
            total_price += this.current_order.butcher.shop.delivery_fee;
        }
        return total_price;
    }

    getCustomerOrdersInfo(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.CUST_ORDERINFO_GET, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    getCustomerOrders(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.CUST_ORDER_GET, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    getButcherOrdersInfo(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.BUT_ORDERINFO_GET, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    getButcherOrders(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.BUT_ORDER_GET, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    placeOrder(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.ORDER_ADD, param, { headers: headers })
            .map((response) => <any>response['message'])
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    updateStatus(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.ORDER_UPDATE_STATUS, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    sendRefundRequest(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.ORDER_REFUND_REQUEST, param, { headers: headers })
            .map((response) => <any>response['data'])
            .toPromise()
            .catch(error => {
                this.errorHandler(error);
            });
    }

    rating(param) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': store.get('token'),
        });
        return this.http.post(API_URL.ORDER_RATTING, param, { headers: headers })
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
