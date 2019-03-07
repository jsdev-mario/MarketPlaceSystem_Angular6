import { Component, OnInit } from '@angular/core';
import { PaymentService, SpinnerService, OrderService } from '../../../service';
import { ToastrService } from 'ngx-toastr';
const moment = require('moment');
import swal from 'sweetalert2';
import { Router } from '@angular/router';

const store = require('store');
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-checkout-orderitems',
    templateUrl: './checkout-orderitems.component.html',
    styleUrls: ['./checkout-orderitems.component.css']
})
export class CheckoutOrderitemsComponent implements OnInit {

    client_token: string;
    nonce: string;
    flag = true;

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


    constructor(
        public payment_service: PaymentService,
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
        public order_service: OrderService,
        public router: Router,
    ) {
        this.selected_butcher = store.get('selected_butcher');
        if (this.order_service.current_order.note && this.order_service.current_order.note.trim() === '') {
            this.order_service.current_order.note = undefined;
        }
    }


    ngOnInit() {
        this.getTotalPrice();
    }

    displayAbbreName() {
        let abbr_name = this.selected_butcher.shop.shop_name.split(' ')[0].charAt(0);
        if (this.selected_butcher.shop.shop_name.split(' ').length > 1) {
            abbr_name += this.selected_butcher.shop.shop_name.split(' ')[1].charAt(0);
        }
        return abbr_name;
    }

    getSubTotalPrice() {
        return this.order_service.getSubTotalPrice();
    }

    getTotalPrice() {
        return this.order_service.getTotalPrice();
    }

    getDeliveryFee() {
        if (this.selected_butcher.shop.delivery_fee === 0.0) {
            return 'free';
        } else {
            return `£ ${this.selected_butcher.shop.delivery_fee.toFixed(2)}`;
        }
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

    displayOrderItemPrice(orderitem) {
        this.order_service.calOrderItemPrice(orderitem);
        return orderitem.sub_price;
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

    displayAddress() {
        let address = this.selected_butcher.shop.address_line1;
        if (this.selected_butcher.shop.address_line2 !== undefined && this.selected_butcher.shop.address_line2 !== '') {
            address += ', ' + this.selected_butcher.shop.address_line2;
        }
        address += ', ' + this.selected_butcher.shop.town_city + ', ' + this.selected_butcher.shop.post_code;
        return address.trim();
    }

    deliveryDateTimeInfo() {
        if (this.order_service.current_order.delivery_date) {
            return `${moment(this.order_service.current_order.delivery_date).format('ddd, DD MMM')},
             Approx ${moment(this.order_service.current_order.delivery_date).format('HH:mm A')} `;
        }
        return '';
    }

    collectionDateTimeInfo() {
        if (this.order_service.current_order.delivery_date) {
            return `${moment(this.order_service.current_order.delivery_date).format('ddd, DD MMM')}
            at ${moment(this.order_service.current_order.delivery_date).format('HH:mm A')} `;
        }
        return '';
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

    gotoOrderPage() {
        this.router.navigate(['/order/menu', this.selected_butcher.shop.shop_name]);
    }

}
