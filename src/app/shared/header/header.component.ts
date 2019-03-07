import { Component, OnInit, AfterContentChecked, AfterContentInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { StatusService, SiteInfoService, SearchService, SysAuthService, OrderService } from '../../service';
import Constants from '../../service/constant';


const store = require('store');
const moment = require('moment');

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterContentChecked {

    selected_butcher: any;
    user: any;
    site_info: any;

    constructor(
        public auth_service: SysAuthService,
        private router: Router,
        public status_service: StatusService,
        public siteinfo_service: SiteInfoService,
        public search_service: SearchService,
        public order_service: OrderService,
    ) {
        this.site_info = store.get('site_info');
        if (!this.site_info) {
            this.siteinfo_service.getSiteInfo().then(data => {
                this.site_info = data;
                store.set('site_info', data);
            });
        }
    }

    ngOnInit() {
        this.selected_butcher = store.get('selected_butcher');
        this.order_service.current_order = store.get('current_order');
    }

    ngAfterContentChecked() {
        this.user = store.get('user');
        this.site_info = store.get('site_info');
        this.selected_butcher = store.get('selected_butcher');
        this.status_service.header_style = 0;
        if (this.router.url === '/order/search') {
            this.status_service.header_style = 1;
        }
        if (this.selected_butcher && this.selected_butcher.shop) {
            if (this.router.url.indexOf('order/menu') > -1) {
                this.status_service.header_style = 1;
            }
        }
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
        this.status_service.expend_menu = false;
        if (this.router.url === '/user/butstocklist' || this.router.url === '/user/butpreferences') {
            this.status_service.logout_delay = true;
            this.router.navigate(['/']);
        } else {
            this.auth_service.logout();
        }
    }

    gotoMenu() {
        store.set('selected_butcher', this.order_service.current_order.butcher);
        this.router.navigate(['/order/menu', this.order_service.current_order.butcher.shop.shop_name]);
    }

    displayAddress() {
        let address = this.selected_butcher.shop.address_line1;
        if (this.selected_butcher.shop.address_line2 !== undefined
            && this.selected_butcher.shop.address_line2 !== '') {
            address += ', ' + this.selected_butcher.shop.address_line2;
        }
        address += ', ' + this.selected_butcher.shop.town_city + ', ' + this.selected_butcher.shop.post_code;
        return address;
    }

    gotoSearch() {
        this.router.navigate(['/order/search']);
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

