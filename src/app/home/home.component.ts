import { Component, OnInit } from '@angular/core';
import {
    SiteInfoService, SearchService, StatusService,
    CommonService, SpinnerService, SysAuthService, OrderService
} from '../service/index';
import { Router } from '@angular/router';
import Constants from '../service/constant';
import { ToastrService } from 'ngx-toastr';

declare var require: any;
const store = require('store');

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

    post_code: string;
    expand_menu = false;
    user: any;
    site_info: any;
    selected_butcher: any;

    constructor(
        public auth_service: SysAuthService,
        private toaster: ToastrService,
        public siteinfo_service: SiteInfoService,
        private search_service: SearchService,
        public order_service: OrderService,
        public status_service: StatusService,
        public common_service: CommonService,
        public spinner_service: SpinnerService,
        private router: Router,
    ) {
        this.user = store.get('user');
        this.selected_butcher = store.get('selected_butcher');
        this.site_info = store.get('site_info');
        this.post_code = this.search_service.post_code || store.get('search_postcode');
        if (this.user && !this.post_code) {
            if (this.user.user_type === Constants.userType.CUSTOMER) {
                if (this.user.delivery_addresses.length > 0) {
                    this.post_code = this.user.delivery_addresses[0].post_code;
                }
            }
        }
        if (!this.site_info) {
            this.siteinfo_service.getSiteInfo().then(data => {
                this.site_info = data;
                store.set('site_info', data);
            }).catch(error => {
                console.log(error);
            });
        }
        if (this.user && this.user.user_type === Constants.userType.BUTCHER) {
            this.router.navigate(['/user/buttodayorder']);
        }
    }

    ngOnInit() {
        this.order_service.current_order = store.get('current_order');
    }

    gotoMenu() {
        store.set('selected_butcher', this.order_service.current_order.butcher);
        this.router.navigate(['/order/menu', this.order_service.current_order.butcher.shop.shop_name]);
    }

    gotoSearch() {
        if (this.user && this.user.user_type === Constants.userType.BUTCHER) {
            return;
        }
        if (!this.post_code || this.post_code === '') {
            this.toaster.error('Please input post code.', 'Error');
            return;
        }
        this.spinner_service.show();
        this.common_service.getDataByPostCode(this.post_code).then((data) => {
            this.spinner_service.hide();
            if (data.status === 200 && data.result) {
                this.search_service.post_code = this.post_code;
                this.search_service.location = {
                    latitude: data.result.latitude,
                    longitude: data.result.longitude
                };
                this.router.navigate(['/order']);
            } else {
                this.toaster.error('Invalid post code', 'Error');
            }
        }).catch(error => {
            this.spinner_service.hide();
            this.toaster.error('Invalid post code', 'Error');
        });
    }

    customerName() {
        if (this.user) {
            if (this.user.user_type === Constants.userType.CUSTOMER) {
                if (this.user.first_name && this.user.last_name) {
                    return this.user.first_name + ' ' + this.user.last_name;
                } else {
                    return this.user.email;
                }
            } else if (this.user.user_type === Constants.userType.BUTCHER) {
                if (this.user.shop && this.user.shop.shop_name) {
                    return this.user.shop.shop_name;
                } else {
                    return this.user.email;
                }
            }
        } else {
            return '';
        }
    }

    displayAbbreName() {
        let abbr_name = this.user.shop.shop_name.split(' ')[0].charAt(0);
        if (this.user.shop.shop_name.split(' ').length > 1) {
            abbr_name += this.user.shop.shop_name.split(' ')[1].charAt(0);
        }
        return abbr_name;
    }

    logOut() {
        this.user = undefined;
        this.status_service.expend_menu = false;
        this.auth_service.logout();
    }

    isShowButcherMenuItem() {
        if (this.user &&
            this.user.user_type === Constants.userType.BUTCHER) {
            return true;
        }
        return false;
    }

    isShowCustomerMenuItem() {
        if (this.user &&
            this.user.user_type === Constants.userType.CUSTOMER) {
            return true;
        }
        return false;
    }

    selectCustMenu(index) {
        this.status_service.expend_menu = false;
        switch (index) {
            case 0:
                this.router.navigate(['/user/custaccount']);
                break;
            case 1:
                this.router.navigate(['/user/custorder']);
                break;
            case 2:
                this.router.navigate(['/weare/contactus']);
                break;
            case 3:
                this.router.navigate(['/auth/login', 'customer']);
                break;
            case 4:
                this.router.navigate(['/auth/signup']);
                break;
            case 5:
                this.logOut();
                break;
        }
    }
}

