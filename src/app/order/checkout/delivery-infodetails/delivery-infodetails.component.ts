import { Component, OnInit } from '@angular/core';
import {
    PaymentService, SpinnerService, OrderService, ValidationService, SysAuthService,
    CommonService, SearchService
} from '../../../service';
import { ToastrService } from 'ngx-toastr';
import Constant from '../../../service/constant';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
const moment = require('moment');
const store = require('store');
declare var $: any;
declare var require: any;


@Component({
    selector: 'app-delivery-infodetails',
    templateUrl: './delivery-infodetails.component.html',
    styleUrls: ['./delivery-infodetails.component.css']
})
export class DeliveryInfodetailsComponent implements OnInit {

    titles = [
        { id: 0, name: Constant.titles_label[0] },
        { id: 1, name: Constant.titles_label[1] },
        { id: 2, name: Constant.titles_label[2] },
        { id: 3, name: Constant.titles_label[3] },
        { id: 4, name: Constant.titles_label[4] },
    ];

    user: any;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    mobile_phone: string;
    email_news: boolean;
    order_sms: boolean;

    selected_butcher: any;
    phone_mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/,
        /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

    delivery_addresses: any[];
    promo_code: string;

    address_line1: string;
    address_line2: string;
    city: string;
    post_code: string;
    address_name: string;

    is_newaddress = false;

    available_daysettings: any[] = [];
    delivery_days: any[] = [];
    delivery_dayno = 0;
    delivery_times: any[] = [];
    delivery_timeno = 0;
    delivery_dates: Date[] = [];
    moment_days: any[] = [];


    constructor(
        public auth_service: SysAuthService,
        public spinner_service: SpinnerService,
        public order_service: OrderService,
        public search_service: SearchService,
        public toaster: ToastrService,
        public validation: ValidationService,
        public common_service: CommonService,
        public router: Router,
    ) {
        this.user = store.get('user');
        this.first_name = this.user.first_name;
        this.last_name = this.user.last_name;
        this.title = this.user.title;
        this.email = this.user.email;
        this.mobile_phone = this.user.mobile_phone;
        this.email_news = this.user.email_news;
        this.order_sms = this.user.order_sms;
        this.selected_butcher = store.get('selected_butcher');
    }

    ngOnInit() {
        this.addressFilter();
        if (this.delivery_addresses.length === 1 &&
            (this.delivery_addresses[0].post_code.toUpperCase() === this.delivery_addresses[0].address_name.toUpperCase())) {
            this.delivery_addresses = [];
        }
        if (this.delivery_addresses.length > 0) {
            this.order_service.current_order.delivery_address = this.delivery_addresses[0];
        }
        this.post_code = this.search_service.post_code || store.get('search_postcode');
        this.address_name = this.search_service.post_code || store.get('search_postcode');
        this.order_service.current_order.user = {};
        this.getDeliveryDays();
        console.log(this.order_service.current_order.delivery_address);
    }

    addressFilter() {
        this.delivery_addresses = [];
        this.user.delivery_addresses.forEach(address => {
            if (this.isAvailableAddress(address)) {
                this.delivery_addresses.push(address);
            }
        });
    }

    isAvailableAddress(address) {
        let distance = this.common_service.getDistanceFromLatLonInKm(
            this.selected_butcher.shop.location.latitude, this.selected_butcher.shop.location.longitude,
            address.location.latitude, address.location.longitude);
        distance = Math.round(distance * 0.621371 * 100) / 100;
        if (distance <= this.selected_butcher.shop.delivery_radius) {
            return true;
        }
        return false;
    }

    displaySwitchLabel(flag) {
        if (flag) {
            return 'ON';
        } else {
            return 'OFF';
        }
    }

    selectDeliveryAddress(index) {
        this.order_service.current_order.delivery_address = this.delivery_addresses[index];
        this.is_newaddress = false;
        if (index === this.delivery_addresses.length) {
            this.is_newaddress = true;
            this.order_service.current_order.delivery_address = undefined;
        }
    }

    goAnotherAccount() {
        this.router.navigate(['/auth/login', 'customer'], { queryParams: { returnUrl: this.router.url } });
    }

    confirmCheckout() {
        if (this.first_name === undefined || this.first_name === '') {
            this.toaster.error('Please input first name', 'Error');
            return;
        }
        if (this.mobile_phone === undefined || this.mobile_phone === '') {
            this.toaster.error('Please input mobile phone', 'Error');
            return;
        }
        this.order_service.current_order.user = {};
        this.order_service.current_order.user._id = this.user._id;
        this.order_service.current_order.user.first_name = this.first_name;
        this.order_service.current_order.user.mobile_phone = this.mobile_phone;
        this.order_service.current_order.user.title = this.title;
        this.order_service.current_order.user.email = this.email;
        this.order_service.current_order.user.email_news = this.email_news;
        this.order_service.current_order.user.order_sms = this.order_sms;
        if (this.last_name !== undefined && this.last_name !== '') {
            this.order_service.current_order.user.last_name = this.last_name;
        }
        if (this.promo_code !== undefined && this.promo_code !== '') {
            this.order_service.current_order.promo_code = this.promo_code;
        }
        if (this.order_service.current_order.delivery_address === undefined) {
            if (this.address_line1 === undefined || this.address_line1 === '') {
                this.toaster.error('Please select address line1', 'Error');
                return;
            }
            if (this.post_code === undefined || this.post_code === '') {
                this.toaster.error('Please select post code', 'Error');
                return;
            }
            if (this.address_name === undefined || this.address_name === '') {
                this.toaster.error('Please select address name', 'Error');
                return;
            }
            this.order_service.current_order.delivery_address = {};
            this.order_service.current_order.delivery_address.address_line1 = this.address_line1;
            this.order_service.current_order.delivery_address.address_name = this.address_name;
            this.order_service.current_order.delivery_address.post_code = this.post_code;
            const param: any = {
                address_line1: this.address_line1,
                post_code: this.post_code,
            };
            if (this.address_line2 !== undefined && this.address_line2 !== '') {
                this.order_service.current_order.delivery_address.address_line2 = this.address_line2;
                param.address_line2 = this.address_line2;
            }
            if (this.city !== undefined && this.city !== '') {
                this.order_service.current_order.delivery_address.city = this.city;
                param.city = this.city;
            }
            this.spinner_service.show();
            this.common_service.getAddressToLocation(param).then(data => {
                this.spinner_service.hide();
                this.order_service.current_order.delivery_address.location = data;
                if (this.isAvailableAddress(this.order_service.current_order.delivery_address)) {
                    $('#configdlg_btn').click();
                } else {
                    this.order_service.current_order.delivery_address = undefined;
                    swal({
                        title: '',
                        text: 'Unfortunately, the selected butcher is not currently delivering in this area',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#F6931D',
                        cancelButtonColor: 'grey',
                        confirmButtonText: 'New Search',
                        cancelButtonText: 'Cancel'
                    }).then((result) => {
                        if (result.value) {
                            this.router.navigate(['/order/search']);
                        }
                    });
                }
            }).catch(error => {
                this.spinner_service.hide();
                this.order_service.current_order.delivery_address = undefined;
                console.log(error);
                if (error.error && error.error.message) {
                    this.toaster.error(error.error.message, 'Error');
                }
            });
            return;
        } else {
            $('#configdlg_btn').click();
        }
    }

    getDeliveryOptionLabel() {
        if (this.order_service.current_order.delivery_option === 1) {
            return 'Delivery';
        } else {
            return 'Collection';
        }
    }

    getCurrentDay() {
        let day = moment().day();
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        return day;
    }

    getDeliveryDays() {
        const day = this.getCurrentDay();
        this.available_daysettings = [];
        this.delivery_days = [];
        this.moment_days = [];
        for (let i = 0; i <= 6; i++) {
            const next_day = (i + day) % 7;
            if (this.selected_butcher.shop.day_settings[next_day].open) {
                if (this.order_service.current_order.delivery_option === 1) {
                    if (this.selected_butcher.shop.day_settings[next_day].has_delivery) {
                        this.selected_butcher.shop.day_settings[next_day].day = next_day;
                        this.available_daysettings.push(this.selected_butcher.shop.day_settings[next_day]);
                        this.moment_days.push(moment().add(i, 'days').startOf('day'));
                    }
                } else {
                    this.selected_butcher.shop.day_settings[next_day].day = next_day;
                    this.available_daysettings.push(this.selected_butcher.shop.day_settings[next_day]);
                    this.moment_days.push(moment().add(i, 'days').startOf('day'));
                }
            }
        }
        this.moment_days.forEach((moment_day, index) => {
            this.delivery_days.push({
                id: index,
                name: moment_day.format('ddd, DD MMM')
            });
        });
        if (this.delivery_days.length > 0) {
            this.delivery_dayno = 0;
            if (this.getCurrentDay() === this.available_daysettings[0].day) {
                this.delivery_days[0].name += ' (ASAP)';
            }
            this.getDeliveryTimes();
        } else {
            this.order_service.current_order.delivery_date = undefined;
        }
    }

    deliveryDayChange(event) {
        this.getDeliveryTimes();
    }

    getDeliveryTimes() {
        this.delivery_times = [];
        this.available_daysettings.forEach((day_setting, index) => {
            if (index === this.delivery_dayno) {
                const et_time = this.order_service.current_order.delivery_option === 1 ? day_setting.end_time : day_setting.closing_time;
                const et_moment_date = moment({
                    year: this.moment_days[index].year(),
                    month: this.moment_days[index].month(),
                    date: this.moment_days[index].date(),
                    hour: moment(et_time).hour(),
                    minutes: moment(et_time).minutes()
                });
                let st_moment_date: any;
                if (this.getCurrentDay() === day_setting.day) {
                    st_moment_date = this.order_service.current_order.delivery_option === 1 ?
                        moment().add(this.selected_butcher.shop.delivery_time, 'minutes') :
                        moment().add(this.selected_butcher.shop.collection_time, 'minutes');
                } else {
                    const st_time = this.order_service.current_order.delivery_option === 1 ?
                        day_setting.start_time : day_setting.opening_time;
                    st_moment_date = moment({
                        year: this.moment_days[index].year(),
                        month: this.moment_days[index].month(),
                        date: this.moment_days[index].date(),
                        hour: moment(st_time).hour(),
                        minutes: moment(st_time).minutes()
                    });
                }
                const duration = moment.duration(et_moment_date.diff(st_moment_date));
                const delta_minutes = duration.asMinutes();
                this.delivery_dates = [];
                for (let i = 0; i < delta_minutes; i += 15) {
                    const st_temp_date = st_moment_date.clone();
                    st_temp_date.add(i, 'minutes');
                    this.delivery_dates.push(st_temp_date.toDate());
                    this.delivery_times.push({
                        id: Math.floor(i / 15),
                        name: st_temp_date.format('HH:mm A')
                    });
                }
                this.delivery_dates.push(et_moment_date.toDate());
                this.delivery_times.push({
                    id: this.delivery_times.length,
                    name: et_moment_date.format('HH:mm A'),
                });
                if (this.delivery_times.length > 0) {
                    this.delivery_times[0].name += ' (ASAP)';
                    this.delivery_timeno = 0;
                    this.order_service.current_order.delivery_date = this.delivery_dates[this.delivery_timeno];
                } else {
                    this.order_service.current_order.delivery_date = undefined;
                }
            }
        });
    }

    deliveryDateChange(event) {
        this.order_service.current_order.delivery_date = this.delivery_dates[this.delivery_timeno];
    }

    isToday() {
        if (!this.order_service.current_order.delivery_date) {
            return false;
        }
        if (this.available_daysettings[this.delivery_dayno].day === this.getCurrentDay()) {
            return true;
        }
        return false;
    }

    displayDeliveryDate() {
        // Wed, 13 Jun. 12:45 pm
        if (this.order_service.current_order.delivery_date) {
            return moment(this.order_service.current_order.delivery_date).format('ddd, DD MMM. HH:mm a');
        }
        return '';
    }

    confirmPay() {
        if (this.order_service.current_order.delivery_date === undefined) {
            return;
        }
        this.order_service.current_order.delivery_date_type = this.isToday() ? 0 : 1;
        store.set('current_order', this.order_service.current_order);
        store.set('from_checkout', true);
        this.router.navigate(['order/payment']);
    }
}
