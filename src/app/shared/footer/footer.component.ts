import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { SearchService, SiteInfoService, PaymentService, SpinnerService } from '../../service';
import Constants from '../../service/constant';
declare var require: any;
const store = require('store');

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterContentChecked {

    user: any;
    site_info: any;

    constructor(
        public search_sevice: SearchService,
        public siteinfo_service: SiteInfoService,
    ) {

    }

    ngOnInit() {
        if (!this.site_info) {
            this.siteinfo_service.getSiteInfo().then(data => {
                this.site_info = data;
                store.set('site_info', this.site_info);
            });
        }
    }

    ngAfterContentChecked() {
        this.user = store.get('user');
        this.site_info = store.get('site_info');
    }

    search(meat_type) {
        this.search_sevice.meat_type = meat_type;
    }

    isShowButcherMenuItem() {
        if (this.user &&
            this.user.user_type === Constants.userType.BUTCHER) {
            return true;
        }
        return false;
    }

    isShowCustomerMenuItem() {
        if (!this.user || (this.user &&
            this.user.user_type === Constants.userType.CUSTOMER)) {
            return true;
        }
        return false;
    }
}
