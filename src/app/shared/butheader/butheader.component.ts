import { Component, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SysAuthService, StatusService, SiteInfoService, SearchService, OrderService, SseService } from '../../service';
import Constants from '../../service/constant';
import { ToastrService } from 'ngx-toastr';


const store = require('store');
const moment = require('moment');

@Component({
    selector: 'app-butheader',
    templateUrl: './butheader.component.html',
    styleUrls: ['./butheader.component.css']
})
export class ButheaderComponent implements OnInit, AfterContentChecked, OnDestroy {

    user: any;
    site_info: any;

    total_butorders_count: any;
    current_order_count: any;
    butbadge_count = 0;


    sel_butmenu = 0;

    header_style = 0;

    but_menus = [
        'Today\'s Order',
        'Orders History',
        'Ratings',
        'Shop preferences',
        'Stocklist',
        'Change Password',
        'Contact us',
        'Logout'
    ];

    constructor(
        public auth_service: SysAuthService,
        private router: Router,
        public status_service: StatusService,
        public siteinfo_service: SiteInfoService,
        public search_service: SearchService,
        public order_service: OrderService,
        private sse_service: SseService,
        public toaster: ToastrService,
    ) {
        this.site_info = store.get('site_info');
        if (!this.site_info) {
            this.siteinfo_service.getSiteInfo().then(data => {
                this.site_info = data;
                store.set('site_info', data);
            });
        }
        if (this.router.url !== '/user/buttodayorder') {
            this.butbadge_count = store.get('butbadge_count') || 0;
        } else {
            this.butbadge_count = 0;
            store.set('butbadge_count', this.butbadge_count);
        }
    }

    ngOnInit() {
        this.connectSSE();
        this.status_service.events.subscribe(result => {
            if (result.message === Constants.eventNames.BUTBADGE_CLEAR) {
                this.butbadge_count = 0;
                store.set('butbadge_count', this.butbadge_count);
            }
        });
    }

    ngOnDestroy() {
        this.sse_service.disconnect();
        // this.status_service.events.unsubscribe();
    }

    ngAfterContentChecked() {
        this.user = store.get('user');
        this.site_info = store.get('site_info');
        if (this.router.url === '/user/buttodayorder') {
            this.sel_butmenu = 0;
        } else if (this.router.url === '/user/butorderhistory') {
            this.sel_butmenu = 1;
        } else if (this.router.url === '/user/butratings') {
            this.sel_butmenu = 2;
        } else if (this.router.url === '/user/butpreferences') {
            this.sel_butmenu = 3;
        } else if (this.router.url === '/user/butstocklist') {
            this.sel_butmenu = 4;
        } else if (this.router.url === '/user/butchangepass') {
            this.sel_butmenu = 5;
        } else if (this.router.url === '/weare/contactus') {
            this.sel_butmenu = 6;
        } else {
            this.sel_butmenu = 7;
        }
    }

    connectSSE() {
        this.sse_service.createEventSource(Constants.sseEventNames.ADD_BUTORDERS, (result) => {
            if (result.data !== 'undefined' && Number(result.data) > 0) {
                this.current_order_count = Number(result.data);
                if (this.total_butorders_count === undefined) {
                    this.total_butorders_count = this.current_order_count;
                }
                if (this.total_butorders_count < this.current_order_count) {
                    this.butbadge_count += this.current_order_count - this.total_butorders_count;
                    this.total_butorders_count = this.current_order_count;
                    store.set('butbadge_count', this.butbadge_count);
                    this.status_service.playAlertSound();
                    this.toaster.success('New order arrived. Please check orders', 'Alarm');
                }
            }
        });
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

    selectButMenu(index) {
        this.status_service.expend_menu = false;
        this.sel_butmenu = index;
        switch (index) {
            case 0:
                this.router.navigate(['/user/buttodayorder']);
                break;
            case 1:
                this.router.navigate(['/user/butorderhistory']);
                break;
            case 2:
                this.router.navigate(['/user/butratings']);
                break;
            case 3:
                this.router.navigate(['/user/butpreferences']);
                break;
            case 4:
                this.router.navigate(['/user/butstocklist']);
                break;
            case 5:
                this.router.navigate(['/user/butchangepass']);
                break;
            case 6:
                this.router.navigate(['/weare/contactus']);
                break;
            case 7:
                this.logOut();
                break;
        }
    }

    gotoDash() {
        if (this.butbadge_count > 0) {
            this.butbadge_count = 0;
            store.set('butbadge_count', this.butbadge_count);
            if (this.router.url === '/user/buttodayorder') {
                this.status_service.events.emit({ message: Constants.eventNames.BUTORDERHIS_REFRESH });
            } else {
                this.router.navigate(['/user/buttodayorder']);
            }
        }
    }

    displayAbbreName() {
        let abbr_name = this.user.shop.shop_name.split(' ')[0].charAt(0);
        if (this.user.shop.shop_name.split(' ').length > 1) {
            abbr_name += this.user.shop.shop_name.split(' ')[1].charAt(0);
        }
        return abbr_name;
    }

    getTodayDate() {
        return moment().format('ddd, DD MMM YYYY');
    }

    getShopOpenInfo() {
        if (this.user.shop.day_settings && this.user.shop.day_settings.length !== 0) {
            const day_setting = this.user.shop.day_settings[this.getToday()];
            if (day_setting.open) {
                return `Shop open: ${moment(day_setting.opening_time).format('HH:mm A')}
                 - ${moment(day_setting.closing_time).format('HH:mm A')}`;
            } else {
                return 'Closed';
            }
        } else {
            return '';
        }
    }

    getShopDeliveryInfo() {
        if (this.user.shop.day_settings && this.user.shop.day_settings.length !== 0) {
            const day_setting = this.user.shop.day_settings[this.getToday()];
            if (day_setting.open && day_setting.has_delivery) {
                return `Delivery: ${moment(day_setting.start_time).format('HH:mm A')}
                 - ${moment(day_setting.end_time).format('HH:mm A')}`;
            } else {
                return 'Not Delivering Today';
            }
        } else {
            return '';
        }
    }

    getToday() {
        let day = moment().day();
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        return day;
    }
}
