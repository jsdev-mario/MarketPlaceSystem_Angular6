import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StatusService, OrderService, SseService } from '../../../service';
import Constants from '../../../service/constant';
import { ToastrService } from 'ngx-toastr';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';


const store = require('store');
const moment = require('moment');


@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {

    order: any;
    user: any;

    constructor(
        private router: Router,
        public status_service: StatusService,
        public order_service: OrderService,
        private sse_service: SseService,
        public toaster: ToastrService,
    ) {
        this.order = store.get('selected_order');
        this.user = store.get('user');
        this.status_service.events.subscribe(result => {
            if (result.message === Constants.eventNames.UPDATE_ORDER_STATUS) {
                this.order = result.data;
            }
        });
    }

    ngOnInit() {

    }

    ngOnDestroy(): void {
        // this.status_service.events.unsubscribe();
    }

    getOrderId() {
        if (this.order) {
            return this.order.order_id.replace('#', '');
        }
        return '';
    }

    getOrderDeliveryLabel() {
        if (this.order) {
            if (this.order.delivery_option === 0) {
                return 'Collection';
            } else {
                return 'Delivery';
            }
        }
        return '';
    }

    isAllocateTime() {
        if (this.order) {
            if (this.order.status === Constants.orderStatus.CONFIRMED_PREPARING
                || this.order.status === Constants.orderStatus.READY_COLLECTION
                || this.order.status === Constants.orderStatus.OUT_DELIVERY
                || this.order.status === Constants.orderStatus.COLLECTED
                || this.order.status === Constants.orderStatus.DELIVERED) {
                return true;
            }
        }
        return false;
    }

    getOrderTime() {
        if (this.order) {
            const date_str = moment(this.order.delivery_date).format('ddd, D MMM YYYY, HH:mm A');
            if (this.order.delivery_date_type === 0) {
                return `${date_str} ASAP`;
            } else {
                return date_str;
            }

        }
        return '';
    }

    getTotalPaymentLabel() {
        if (this.order.payment_method === Constants.paymentMethod.CARD) {
            return 'Payment paid by card';
        } else if (this.order.payment_method === Constants.paymentMethod.PAYPAL) {
            return 'Payment paid by paypal';
        } else {
            return 'Payment paid by cash payment is due';
        }
    }

    unit(product) {
        let unit = 'Each';
        if (product.unit === 1) {
            unit = 'Kg';
        } else if (product.unit === 2) {
            unit = 'g';
        }
        return unit;
    }

    displayMenuName(product) {
        let menu_name = product.subcategory.name + ' - ';
        if (this.unit(product) !== 'Each') {
            menu_name += `${product.qty} `;
        }
        return menu_name + `${this.unit(product)}`;
    }

    getPaymentType() {
        if (this.order) {
            if (this.order.payment_method === Constants.paymentMethod.CARD) {
                return 'Card';
            } else if (this.order.payment_method === Constants.paymentMethod.CASH) {
                return 'Cash';
            } else {
                return 'Paypal';
            }
        }
    }

    getOfferInfo(order_item) {
        if (order_item.has_save) {
            return `${Math.floor(order_item.count / order_item.product.offer.qty)} ☓ ${order_item.product.name}
             offer ${order_item.product.offer.qty} for £ ${order_item.product.offer.price.toFixed(2)}`;
        }
    }

    getButcherConfirmTime() {
        if (this.order && this.isAllocateTime()) {
            return `Expected ${this.getOrderDeliveryLabel().toLowerCase()}
             time : ${moment(this.order.delivery_date).add(this.order.but_confirm_delivery_time, 'minutes').format('HH:mm A')}`;
        }
    }

    getButcherAddedTimeDescription() {
        if (this.order.but_confirm_delivery_time === 0) {
            return `Butcher hasn't added time to the ${this.getOrderDeliveryLabel()} time`;
        }
        return `Butcher has added ${this.order.but_confirm_delivery_time} minutes to the ${this.getOrderDeliveryLabel()} time`;
    }

    isButcher() {
        if (this.user.user_type === Constants.userType.BUTCHER) {
            return true;
        }
        return false;
    }
}
