import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StatusService, SearchService, CommonService } from '../../service';
import { ToastrService } from 'ngx-toastr';
const store = require('store');
const moment = require('moment');

@Component({
    selector: 'app-butcher',
    templateUrl: './butcher.component.html',
    styleUrls: ['./butcher.component.css', './butcher.component.scss']
})
export class ButcherComponent implements OnInit {

    @Input() butcher: any;

    day_setting: any;
    delivery_day_setting: any;
    is_open = true;
    is_start = true;


    temp_rate = 4;
    days: string[] = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    constructor(
        private router: Router,
        public search_service: SearchService,
        public common_service: CommonService,
        public toaster: ToastrService
    ) { }

    ngOnInit() {
        this.displayOpenTime();
        this.displayStartTime();
    }

    displayMeatType() {
        if (this.butcher) {
            let meat_types = '';
            this.butcher.shop.meat_types.forEach(element => {
                meat_types += element + ', ';
            });
            return meat_types.slice(0, -2);
        }
        return '';
    }

    viewMenu() {
        if (!this.isOffline()) {
            store.set('selected_butcher', this.butcher);
            this.router.navigate(['order/menu', this.butcher.shop.shop_name]);
        }
    }

    isOffline() {
        if (!this.butcher.shop.shop_menu || !this.butcher.shop.shop_menu.categories ||
            this.butcher.shop.shop_menu.categories.length <= 0) {
            return true;
        }
        if (!this.butcher.shop.day_settings || this.butcher.shop.day_settings.length === 0) {
            return true;
        }
        for (let i = 0; i < this.butcher.shop.day_settings.length; i++) {
            if (this.butcher.shop.day_settings[i].open) {
                return false;
            }
        }
        return true;
    }

    displayAbbreName() {
        let abbr_name = this.butcher.shop.shop_name.split(' ')[0].charAt(0);
        if (this.butcher.shop.shop_name.split(' ').length > 1) {
            abbr_name += this.butcher.shop.shop_name.split(' ')[1].charAt(0);
        }
        return abbr_name;
    }

    displayAvailablePrice() {
        if (this.delivery_day_setting.has_delivery) {
            if (this.is_open && !this.is_start) {
                return 'Collection is available';
            } else {
                return `Minimum Order: £ ${this.butcher.shop.min_delivery_price.toFixed(2)}`;
            }
        } else {
            return 'Collection only';
        }
    }

    displayOpenTime() {
        let day = moment().day();
        const c_time = this.getMinutesNumber(new Date());
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        if (this.butcher && this.butcher.shop) {
            this.day_setting = this.butcher.shop.day_settings[day];
            const opening_time = this.getMinutesNumber(new Date(this.day_setting.opening_time));
            const closing_time = this.getMinutesNumber(new Date(this.day_setting.closing_time));
            if (!this.day_setting.open || c_time > closing_time) {
                this.is_open = false;
                const next_day = this.nextOpenDay();
                return `Opening ${this.days[next_day]} ${moment(this.day_setting.opening_time).format('h:mm A')}`;
            } else {
                if (c_time < opening_time) {
                    this.is_open = false;
                    return `Opening at ${moment(this.day_setting.opening_time).format('h:mm A')}`;
                } else {
                    this.is_open = true;
                    return '';
                }
            }
        }
    }

    displayStartTime() {
        let day = moment().day();
        const c_time = this.getMinutesNumber(new Date());
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        if (this.butcher && this.butcher.shop) {
            this.delivery_day_setting = this.butcher.shop.day_settings[day];
            const start_time = this.getMinutesNumber(new Date(this.delivery_day_setting.start_time));
            const end_time = this.getMinutesNumber(new Date(this.delivery_day_setting.end_time));
            if (!this.delivery_day_setting.open || c_time > end_time || !this.delivery_day_setting.has_delivery) {
                const next_day = this.nextStartDay();
                this.delivery_day_setting = this.butcher.shop.day_settings[next_day];
                this.is_start = false;
                if (day === next_day) {
                    if (this.delivery_day_setting.open) {
                        if (!this.delivery_day_setting.has_delivery) {
                            return '';
                        } else {
                            return `Delivery: From ${this.days[next_day]} ${moment(this.delivery_day_setting.start_time).format('h:mm A')}`;
                        }
                    } else {
                        this.delivery_day_setting.has_delivery = false;
                        return '';
                    }
                } else {
                    if (this.is_open) {
                        return `Delivery: From ${this.days[next_day]} ${moment(this.delivery_day_setting.start_time).format('h:mm A')}`;
                    } else {
                        return `Delivery: £ ${this.butcher.shop.delivery_fee.toFixed(2)}`;
                    }
                }
            } else {
                if (c_time < start_time) {
                    this.is_start = false;
                    return `Delivery: From ${moment(this.delivery_day_setting.start_time).format('h:mm A')}`;
                } else {
                    this.is_start = true;
                    return `Delivery: £ ${this.butcher.shop.delivery_fee.toFixed(2)}`;
                }
            }
        }
    }

    nextOpenDay() {
        let day = moment().day();
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        for (let i = 1; i <= 6; i++) {
            const next_day = (i + day) % 7;
            if (this.butcher.shop.day_settings[next_day].open) {
                return next_day;
            }
        }
        return day;
    }

    nextStartDay() {
        let day = moment().day();
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        for (let i = 1; i <= 6; i++) {
            const next_day = (i + day) % 7;
            if (this.butcher.shop.day_settings[next_day].open && this.butcher.shop.day_settings[next_day].has_delivery) {
                return next_day;
            }
        }
        return day;
    }

    getMinutesNumber(date) {
        return date.getHours() * 60 + date.getMinutes();
    }
}
