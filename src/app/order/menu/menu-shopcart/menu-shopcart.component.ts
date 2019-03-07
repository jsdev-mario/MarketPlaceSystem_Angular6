import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService, OrderService, SiteInfoService } from '../../../service';
import Constant from '../../../service/constant';
import { Router, ActivatedRoute } from '@angular/router';
const store = require('store');
const moment = require('moment');
import swal from 'sweetalert2';
declare var $: any;

@Component({
    selector: 'app-menu-shopcart',
    templateUrl: './menu-shopcart.component.html',
    styleUrls: ['./menu-shopcart.component.css']
})
export class MenuShopcartComponent implements OnInit, OnDestroy {

    selected_butcher: any;
    day_setting: any;
    delivery_day_setting: any;
    is_open = true;
    is_start = true;

    offer_orderitems: any[] = [];
    save_price = 0.0;

    days: string[] = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

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
        public siteinfo_service: SiteInfoService,
        public router: Router,
        public active_router: ActivatedRoute,
    ) {

    }

    ngOnInit() {
        this.routersub = this.active_router.params.subscribe(params => {
            this.selected_butcher = store.get('selected_butcher');
            console.log(this.selected_butcher);
            this.getOpeningTime();
            this.getStartTime();
            if (this.order_service.current_order.delivery_option === 1 && !this.delivery_day_setting.has_delivery) {
                this.order_service.current_order.delivery_option = 0;
            }
        });
    }

    ngOnDestroy(): void {
        this.routersub.unsubscribe();
    }

    getOpeningTime() {
        let day = moment().day();
        const c_time = this.getMinutesNumber(new Date());
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        if (this.selected_butcher && this.selected_butcher.shop) {
            this.day_setting = this.selected_butcher.shop.day_settings[day];
            const opening_time = this.getMinutesNumber(new Date(this.day_setting.opening_time));
            const closing_time = this.getMinutesNumber(new Date(this.day_setting.closing_time));
            if (!this.day_setting.open || c_time > closing_time) {
                const next_day = this.nextOpenDay();
                this.day_setting = this.selected_butcher.shop.day_settings[next_day];
                this.is_open = false;
                return `${this.days[next_day]} ${moment(this.day_setting.opening_time).format('h:mm A')}`;
            } else {
                if (c_time < opening_time) {
                    this.is_open = false;
                    return `${moment(this.day_setting.opening_time).format('h:mm A')}`;
                } else {
                    this.is_open = true;
                    return `Approx. ${this.selected_butcher.shop.collection_time} mins`;
                }
            }
        }
    }

    getStartTime() {
        let day = moment().day();
        const c_time = this.getMinutesNumber(new Date());
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        if (this.selected_butcher && this.selected_butcher.shop) {
            this.delivery_day_setting = this.selected_butcher.shop.day_settings[day];
            const start_time = this.getMinutesNumber(new Date(this.delivery_day_setting.start_time));
            const end_time = this.getMinutesNumber(new Date(this.delivery_day_setting.end_time));
            if (!this.delivery_day_setting.open || c_time > end_time || !this.delivery_day_setting.has_delivery) {
                const next_day = this.nextStartDay();
                this.delivery_day_setting = this.selected_butcher.shop.day_settings[next_day];
                this.is_start = false;
                if (day === next_day) {
                    if (this.delivery_day_setting.open) {
                        if (!this.delivery_day_setting.has_delivery) {
                            return 'Not Available';
                        } else {
                            return `Next week ${this.days[next_day]} ${moment(this.delivery_day_setting.start_time).format('h:mm A')}`;
                        }
                    } else {
                        this.delivery_day_setting.has_delivery = false;
                        return 'Not Available';
                    }
                } else {
                    return `${this.days[next_day]} ${moment(this.delivery_day_setting.start_time).format('h:mm A')}`;
                }
            } else {
                if (c_time < start_time) {
                    this.is_start = false;
                    return `${moment(this.delivery_day_setting.start_time).format('h:mm A')}`;
                } else {
                    this.is_start = true;
                    return `Approx. ${this.selected_butcher.shop.delivery_time} mins`;
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
            if (this.selected_butcher.shop.day_settings[next_day].open) {
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
            if (this.selected_butcher.shop.day_settings[next_day].open && this.selected_butcher.shop.day_settings[next_day].has_delivery) {
                return next_day;
            }
        }
        return day;
    }

    getMinutesNumber(date) {
        return date.getHours() * 60 + date.getMinutes();
    }

    selectDeliveryOption(option) {
        if (this.delivery_day_setting.has_delivery) {
            this.order_service.current_order.delivery_option = option;
            store.set('current_order', this.order_service.current_order);
        }
    }

    displayChoice(choices) {
        let choice_str = '';
        choices.forEach(element => {
            choice_str += element.name;
            if (element.price !== 0.0) {
                choice_str += ': £' + element.price;
            }
            choice_str += ', ';
        });
        return choice_str.substring(0, choice_str.length - 2);
    }

    displayOrderItemPrice(orderitem) {
        this.order_service.calOrderItemPrice(orderitem);
        return orderitem.sub_price;
    }

    offer(order_item) {
        if (order_item.product.offer) {
            let unit = 'Each';
            if (order_item.product.unit === 1) {
                unit = 'Kg';
            } else if (order_item.product.unit === 2) {
                unit = 'g';
            }
            return `${Math.floor(order_item.count / order_item.product.offer.qty)} × ${order_item.product.subcategory.name}
                Offer ${order_item.product.offer.qty} for £ ${order_item.product.offer.price.toFixed(2)}`;
        }
        return '';
    }

    decreaseOrderItemCount(index) {
        const order_item = this.order_service.current_order.order_items[index];
        const count = order_item.count - 1;
        if (count === 0) {
            swal({
                title: 'Remove Item From Basket',
                text: 'Are you sure you wish to remove this item from your basket?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#F6931D',
                cancelButtonColor: 'grey',
                confirmButtonText: 'Remove',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.value) {
                    this.order_service.current_order.order_items.splice(index, 1);
                    store.set('current_order', this.order_service.current_order);
                }
            });
        } else {
            order_item.count -= 1;
        }
        store.set('current_order', this.order_service.current_order);
    }

    increaseOrderItemCount(index) {
        const order_item = this.order_service.current_order.order_items[index];
        order_item.count = Number(order_item.count) + 1;
        store.set('current_order', this.order_service.current_order);
    }

    getDeliveryFee() {
        if (this.selected_butcher.shop.delivery_fee === 0.0) {
            return 'free';
        } else {
            return `£ ${this.selected_butcher.shop.delivery_fee.toFixed(2)}`;
        }
    }

    gotoCheckOut() {
        this.getOpeningTime();
        this.getStartTime();
        if (!this.is_open) {
            swal({
                title: '',
                text: 'Shop is closed at the moment\r\nplease search for other local butcher ',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#F6931D',
                cancelButtonColor: 'grey',
                confirmButtonText: 'Ok',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.value) {
                    this.router.navigate(['/order/search']);
                }
            });
            return;
        } else {
            if (this.order_service.current_order.delivery_option === 0) {
                // this.getDeliveryDays();
                $('#configdlg_btn').click();
            } else {
                this.order_service.current_order.delivery_fee = this.selected_butcher.shop.delivery_fee;
                store.set('current_order', this.order_service.current_order);
                store.set('from_menu', true);
                this.router.navigate(['order/checkout']);
            }
        }
    }

    canCheckOut() {
        if (this.selected_butcher._id !== this.order_service.current_order.butcher._id) {
            return false;
        }
        const sub_price = this.order_service.getSubTotalPrice();
        if (sub_price === 0) {
            return false;
        }
        if (sub_price >= this.selected_butcher.shop.min_delivery_price
            && this.order_service.current_order.delivery_option === Constant.deliveryType.DELIVERY) {
            return true;
        } else if (sub_price >= this.selected_butcher.shop.min_collection_price
            && this.order_service.current_order.delivery_option === Constant.deliveryType.COLLECTION) {
            return true;
        }
        return false;
    }

    displayDeliveryFee() {
        if (!this.delivery_day_setting.has_delivery) {
            return 'Not Available';
        }
        if (this.selected_butcher.shop.delivery_fee === undefined || this.selected_butcher.shop.delivery_fee === 0.0) {
            return 'Free';
        }
        return `£ ${this.selected_butcher.shop.delivery_fee.toFixed(2)}`;
    }

    unit(subcategory) {
        let unit = 'Each';
        if (subcategory.unit === 1) {
            unit = 'Kg';
        } else if (subcategory.unit === 2) {
            unit = 'g';
        }
        return unit;
    }

    displayMenuName(subcategory) {
        let menu_name = subcategory.subcategory.name + ' - ';
        if (this.unit(subcategory) !== 'Each') {
            menu_name += `${subcategory.qty} `;
        }
        return menu_name + `${this.unit(subcategory)}`;
    }

    getTotalPrice() {
        return this.order_service.getTotalPrice();
    }

    getSubTotalPrice() {
        return this.order_service.getSubTotalPrice();
    }


}
