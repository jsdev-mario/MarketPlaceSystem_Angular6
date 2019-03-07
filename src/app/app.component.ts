import { Component, OnInit } from '@angular/core';
import { SiteInfoService, SpinnerService, StatusService, OrderService, SysAuthService } from './service/index';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

declare var require: any;
const store = require('store');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    site_info: any;

    constructor(
        public auth_service: SysAuthService,
        public siteinfo_service: SiteInfoService,
        public spinner_service: SpinnerService,
        public status_service: StatusService,
        public order_service: OrderService,
        public router: Router,

    ) {
        if (store.get('token')) {
            const jwthelper = new JwtHelperService();
            if (jwthelper.isTokenExpired(store.get('token'))) {
                this.auth_service.logout();
            }
        }
        this.siteinfo_service.getSiteInfo().then(data => {
            this.site_info = data;
            store.set('site_info', data);
            $(document).ready(() => {
                $('body').css('background-image', 'url(' + this.site_info.bg_image + ')');
                $('#favicon').attr('href', this.site_info.icon);
                document.title = this.site_info.site_name;
            });
        }).catch(error => {
            $('body').css('background-image', 'url(assets/images/home_back.jpg)');
        });
        if (store.get('from_checkout')) {
            store.remove('from_checkout');
        }
        if (store.get('from_menu')) {
            store.remove('from_menu');
        }
    }

    ngOnInit(): void {
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterContentChecked() {
        if (store.get('token')) {
            const token = store.get('token');
            const helper = new JwtHelperService();
            if (helper.isTokenExpired(token)) {
                this.auth_service.logout();
            }
        }
    }
}

declare var $: any;
