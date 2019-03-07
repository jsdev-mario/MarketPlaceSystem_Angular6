import { Component, OnInit, Directive, ViewChild, ElementRef, AfterViewChecked, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuService, OrderService, StatusService, SpinnerService, PaymentService } from '../../service/index';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService, Toast } from 'ngx-toastr';
import swal from 'sweetalert2';
const store = require('store');
const moment = require('moment');
declare var $: any;



@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {

    @ViewChild('shopcartcontent') shopcartDiv: ElementRef;


    selected_butcher: any;
    tem_rate = 4;
    day_setting: any;
    is_smalldevice = false;
    shopcart_height: number;

    /** confirm delivery  */
    available_daysettings: any[] = [];
    delivery_days: any[] = [];
    delivery_dayno = 0;
    delivery_times: any[] = [];
    delivery_timeno = 0;
    delivery_dates: Date[] = [];
    moment_days: any[] = [];
    delivery_date: Date;
    routersub: any;


    constructor(
        public menu_service: MenuService,
        public order_service: OrderService,
        public status_service: StatusService,
        public spinner_service: SpinnerService,
        private router: Router,
        public toaster: ToastrService,
        public active_router: ActivatedRoute,
        public payment_service: PaymentService,
    ) {
        this.routersub = this.active_router.params.subscribe(params => {
            this.initData();
        });
    }

    initData() {
        this.selected_butcher = store.get('selected_butcher');
        if (!this.selected_butcher) {
            this.router.navigate(['order/search']);
            return;
        }
        this.status_service.header_style = 1;
        this.order_service.current_order = store.get('current_order');
        if (!this.order_service.current_order) {
            this.order_service.current_order = {};
            this.order_service.current_order.delivery_option = 1;
            this.order_service.current_order.order_items = [];
            this.order_service.current_order.note = '';
            this.order_service.current_order.butcher = this.selected_butcher;
        }
        store.set('current_order', this.order_service.current_order);
        this.getDeliveryDays();
        this.spinner_service.show();
        this.menu_service.shopMenu(this.selected_butcher.shop.shop_menu).then(data => {
            this.spinner_service.hide();
            this.menu_service.setMenu(data);
            if (!this.menu_service.isExistMenu()) {
                this.toaster.error('This shop haven\'t menu yet.', 'Error');
                this.router.navigate(['order/search']);
            }
        }).catch(error => {
            this.spinner_service.hide();
            this.menu_service.menu = undefined;
            console.log(error.error);
            this.toaster.error('This shop haven\'t menu yet.', 'Error');
            this.router.navigate(['order/search']);
        });
    }

    ngOnDestroy(): void {
        this.routersub.unsubscribe();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (window.innerWidth > 768) {
            this.is_smalldevice = false;
        } else {
            this.is_smalldevice = true;
        }
        this.shopcart_height = this.shopcartDiv.nativeElement.offsetHeight;
    }

    ngAfterViewChecked() {
        if (this.is_smalldevice) {
            return;
        }
        if (this.shopcartDiv.nativeElement.offsetHeight !== this.shopcart_height) {
            this.shopcart_height = this.shopcartDiv.nativeElement.offsetHeight;
            this.status_service.menuStickybarUpdate();
        }
    }

    onResize(event) {
        if (event.target.innerWidth > 768) {
            if (this.is_smalldevice) {
                this.is_smalldevice = false;
                this.status_service.menuStickybarInit();
                this.status_service.menuStickybarUpdate();
            }
        } else {
            if (!this.is_smalldevice) {
                this.is_smalldevice = true;
                this.status_service.menuStickybarDestory();
            }
        }
    }

    getOpenHours() {
        let day = moment().day();
        const c_time = new Date().getTime();
        let str = '';
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        if (this.selected_butcher && this.selected_butcher.shop) {
            this.day_setting = this.selected_butcher.shop.day_settings[day];
            if (!this.day_setting.open) {
                return 'Closed';
            }
            const opening_time = new Date(this.day_setting.opening_time).getTime();
            const closing_time = new Date(this.day_setting.closing_time).getTime();
            if (c_time >= opening_time && c_time < closing_time) {
                str += 'Open today: ' + moment(this.day_setting.opening_time).format('h:mm A')
                    + ' - ' + moment(this.day_setting.closing_time).format('h:mm A');
            }
            if (str === '') {
                return 'Closed';
            }
            return str;
        }
    }
    /**
         * confirm dlg
        */

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
                this.selected_butcher.shop.day_settings[next_day].day = next_day;
                this.available_daysettings.push(this.selected_butcher.shop.day_settings[next_day]);
                this.moment_days.push(moment().add(i, 'days').startOf('day'));
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
            this.delivery_date = undefined;
        }
    }

    deliveryDayChange(event) {
        this.getDeliveryTimes();
    }

    getDeliveryTimes() {
        this.delivery_times = [];
        this.available_daysettings.forEach((day_setting, index) => {
            if (index === this.delivery_dayno) {
                const et_time = day_setting.closing_time;
                const et_moment_date = moment({
                    year: this.moment_days[index].year(),
                    month: this.moment_days[index].month(),
                    date: this.moment_days[index].date(),
                    hour: moment(et_time).hour(),
                    minutes: moment(et_time).minutes()
                });
                let st_moment_date: any;
                if (this.getCurrentDay() === day_setting.day) {
                    st_moment_date = moment().add(this.selected_butcher.shop.collection_time, 'minutes');
                } else {
                    const st_time = day_setting.opening_time;
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
                    this.delivery_date = this.delivery_dates[this.delivery_timeno];
                } else {
                    this.delivery_date = undefined;
                }
            }
        });
    }

    deliveryDateChange(event) {
        this.delivery_date = this.delivery_dates[this.delivery_timeno];
    }

    isToday() {
        if (!this.delivery_date) {
            return false;
        }
        if (this.available_daysettings[this.delivery_dayno].day === this.getCurrentDay()) {
            return true;
        }
        return false;
    }

    displayDeliveryDate() {
        // Wed, 13 Jun. 12:45 pm
        if (this.delivery_date) {
            return moment(this.delivery_date).format('ddd, DD MMM. HH:mm a');
        }
        return '';
    }

    confirmPay() {
        if (this.delivery_date === undefined) {
            return;
        }
        this.order_service.current_order.delivery_date = this.delivery_date;
        this.order_service.current_order.delivery_date_type = this.isToday() ? 0 : 1;
        store.set('current_order', this.order_service.current_order);
        store.set('from_checkout', true);
        this.router.navigate(['order/payment']);
        // this.payment_service.getAccessToken();
    }
}
