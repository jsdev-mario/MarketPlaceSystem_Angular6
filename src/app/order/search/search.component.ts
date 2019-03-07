import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SearchService, SiteInfoService, CommonService } from '../../service/index';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
declare var require: any;
const store = require('store');

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    post_code = '';
    shop_name = '';
    meat_type = 0;
    sort_item = 0;

    sort_items = [
        { id: 0, name: 'A-Z' },
        { id: 1, name: 'Best Match' },
        { id: 2, name: 'Distance' },
    ];
    meat_types = [
        { id: 0, name: 'All' },
    ];

    all_butchers: any[] = [];
    butchers: any[];
    user: any;
    site_info: any;

    constructor(
        public search_service: SearchService,
        public siteinfo_service: SiteInfoService,
        public common_service: CommonService,
        public toaster: ToastrService,
    ) {
        this.search_service.post_code = this.search_service.post_code || store.get('search_postcode');
        this.search_service.location = this.search_service.location || store.get('search_location');

        this.user = store.get('user');
        this.site_info = store.get('site_info');
        if (!this.site_info) {
            this.siteinfo_service.getSiteInfo().then(data => {
                this.site_info = data;
                store.set('site_info', data);
                this.initMeatType();
            }).catch(error => {
                console.log(error);
            });
        } else {
            this.initMeatType();
        }
        this.post_code = this.search_service.post_code;
        this.shop_name = this.search_service.shop_name;
        this.sort_item = this.search_service.sort_item;
        this.meat_type = this.search_service.meat_type;
        this.butchers = undefined;
        if (this.user) {
            for (let i = 0; i < this.user.delivery_addresses.length; i++) {
                const address = this.user.delivery_addresses[i];
                if (address.post_code === this.search_service.post_code) {
                    this.search_service.location = address.location;
                    console.log(this.user);
                    console.log(this.search_service.location);
                }
            }
        }
    }

    ngOnInit() {
        this.search_service.search().then(data => {
            this.all_butchers = data;
            console.log(this.all_butchers);
            this.filterBuchers();
        }).catch(error => {
            this.butchers = [];
            console.log(error);
        });
    }

    initMeatType() {
        this.site_info.meat_types.forEach((element, index) => {
            this.meat_types.push({
                id: index + 1,
                name: element,
            });
        });
    }

    filterBuchers() {
        this.butchers = [];
        console.log('postcode', this.search_service.post_code);
        if (!this.search_service.post_code) {
            return;
        }
        this.all_butchers.map(element => {
            element.distance = this.calDistanceMile(element);
            return element;
        });

        // delivery radius filter
        this.all_butchers.forEach(element => {
            if (element.distance <= element.shop.delivery_radius) {
                this.butchers.push(element);
            }
        });
        // shop name and product name filter
        if (this.search_service.shop_name) {
            const temp_butchers: any[] = [];
            this.butchers.forEach(element => {
                if (element.shop.shop_name.toLowerCase().indexOf(this.search_service.shop_name.toLowerCase()) > -1
                    || this.isExistProduct(element, this.search_service.shop_name)) {
                    temp_butchers.push(element);
                }
            });
            this.butchers = temp_butchers;
            console.log(this.butchers);
        }

        // sort
        if (this.sort_item === 0) {
            this.butchers.sort(this.nameCompare);
        } else {
            if (this.user) {
                this.butchers.sort(this.distanceCompare);
            }
        }

        // meat type filter
        if (this.meat_type !== 0) {
            const temp_butchers: any[] = [];
            this.butchers.forEach(element => {
                if (element.shop.meat_types.indexOf(this.site_info.meat_types[this.meat_type - 1]) !== -1) {
                    temp_butchers.push(element);
                }
            });
            this.butchers = temp_butchers;
        }
    }

    isExistProduct(butcher, product) {
        if (butcher.shop.shop_menu && butcher.shop.shop_menu.categories && butcher.shop.shop_menu.categories.length > 0) {
            for (let i = 0; i < butcher.shop.shop_menu.categories.length; i++) {
                const category_name = butcher.shop.shop_menu.categories[i].name;
                if (category_name.toLowerCase().indexOf(product.toLowerCase()) > -1) {
                    return true;
                }
            }
        }
        return false;
    }

    nameCompare(a: any, b: any) {
        if (a.shop.shop_name.toLowerCase() < b.shop.shop_name.toLowerCase()) {
            return -1;
        }
        if (a.shop.shop_name.toLowerCase() > b.shop.shop_name.toLowerCase()) {
            return 1;
        }
        return 0;
    }

    distanceCompare(a: any, b: any) {
        if (a.ge < b.distance) {
            return -1;
        }
        if (a.distance > b.distance) {
            return 1;
        }
        return 0;
    }

    sortChange() {
        this.search_service.sort_item = this.sort_item;
        this.filterBuchers();
    }

    meatTypeChange(event) {
        this.search_service.meat_type = this.meat_type;
        this.filterBuchers();
    }

    postCodeChange() {
        if (!this.post_code || this.post_code === '') {
            this.search_service.post_code = undefined;
            this.filterBuchers();
            return;
        }
        this.search_service.post_code = this.post_code;
        this.butchers = undefined;
        this.common_service.getDataByPostCode(this.post_code).then(data => {
            if (data.status === 200 && data.result) {
                this.search_service.location = {
                    latitude: data.result.latitude,
                    longitude: data.result.longitude
                };
                this.filterBuchers();
            } else {
                this.toaster.error('Invalid post code', 'Error');
                this.search_service.post_code = undefined;
                this.filterBuchers();
            }
        }).catch(error => {
            this.toaster.error('Invalid post code', 'Error');
            this.search_service.post_code = undefined;
            this.filterBuchers();
        });
    }

    shopNameChange() {
        if (this.shop_name === '') {
            this.shop_name = undefined;
        }
        this.search_service.shop_name = this.shop_name;
        this.filterBuchers();
    }

    calDistanceMile(butcher: any) {
        const distance = this.common_service.getDistanceFromLatLonInKm(
            butcher.shop.location.latitude, butcher.shop.location.longitude,
            this.search_service.location.latitude, this.search_service.location.longitude);
        return Math.round(distance * 0.621371 * 100) / 100;
    }
}



