import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import Constants from '../../service/constant';
import { ToastrService } from 'ngx-toastr';


const store = require('store');
const moment = require('moment');


@Component({
    selector: 'app-orderheader',
    templateUrl: './orderheader.component.html',
    styleUrls: ['./orderheader.component.css']
})
export class OrderheaderComponent implements OnInit {

    user: any;
    order: any;

    constructor(
        private router: Router,
        public toaster: ToastrService,
        private location: Location,
    ) {
        this.user = store.get('user');
        this.order = store.get('selected_order');
        if (!this.order) {
            if (this.isButcher()) {
                this.router.navigate(['/user/butorderhistory']);
            } else {
                this.router.navigate(['/user/custtodayorder']);
            }
        }
    }

    ngOnInit() {

    }

    isButcher() {
        if (this.user && this.user.user_type === Constants.userType.BUTCHER) {
            return true;
        }
        return false;
    }

    displayAbbreName() {
        let abbr_name = '';
        if (this.order) {
            abbr_name = this.order.butcher.shop.shop_name.split(' ')[0].charAt(0);
            if (this.order.butcher.shop.shop_name.split(' ').length > 1) {
                abbr_name += this.order.butcher.shop.shop_name.split(' ')[1].charAt(0);
            }
        }
        return abbr_name;
    }

    getOrderId() {
        if (this.order) {
            return this.order.order_id.replace('#', '');
        }
        return '';
    }

    getOrderCustName() {
        let cust_name = '';
        if (this.order) {
            if (this.order.delivery_option === 1) {
                cust_name += `${Constants.titles[this.order.customer.title] || ''} `;
                cust_name += `${this.order.customer.first_name} ${this.order.customer.last_name}`;
            } else {
                cust_name += `${Constants.titles[this.order.customer.ref_id.title] || ''} `;
                cust_name += `${this.order.customer.ref_id.first_name} ${this.order.customer.ref_id.last_name}`;
            }
        }
        return cust_name;
    }

    getOrderCustPhone() {
        let phone = '';
        if (this.order) {
            if (this.order.delivery_option === 1) {
                phone = this.order.customer.mobile_phone;
            } else {
                phone = this.order.customer.ref_id.mobile_phone;
            }
        }
        return phone;
    }

    getOrderAddressLine1() {
        let address_line1 = '';
        if (this.order) {
            if (this.order.delivery_option === 1) {
                address_line1 = this.order.delivery_address.address_line1;
            } else {
                address_line1 = this.order.customer.ref_id.delivery_addresses[0].address_line1;
            }
        }
        return address_line1;
    }

    getOrderAddressLine2() {
        let address_line2 = '';
        if (this.order) {
            if (this.order.delivery_option === 1) {
                address_line2 = this.order.delivery_address.address_line2;
            } else {
                address_line2 = this.order.customer.ref_id.delivery_addresses[0].address_line2;
            }
        }
        return address_line2;
    }

    getOrderCity() {
        let city = '';
        if (this.order) {
            if (this.order.delivery_option === 1) {
                city = this.order.delivery_address.city;
            } else {
                city = this.order.customer.ref_id.delivery_addresses[0].city;
            }
        }
        return city;
    }

    getOrderPostCode() {
        let post_code = '';
        if (this.order) {
            if (this.order.delivery_option === 1) {
                post_code = this.order.delivery_address.post_code;
            } else {
                post_code = this.order.customer.ref_id.delivery_addresses[0].post_code;
            }
        }
        return post_code;
    }

    goBack() {
        this.location.back();
    }

}
