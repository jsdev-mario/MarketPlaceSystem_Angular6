import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StatusService, OrderService, SseService, SpinnerService } from '../../../service';
import Constants from '../../../service/constant';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';

const store = require('store');
import * as moment from 'moment';


@Component({
    selector: 'app-cust-order-control',
    templateUrl: './cust-order-control.component.html',
    styleUrls: ['./cust-order-control.component.css']
})
export class CustOrderControlComponent implements OnInit {
    order: any;
    user: any;
    star = 1;

    order_statuses = [
        'Awaiting confirmation!',       // 0
        'Confirmed/Preparing',          // 1
        'Ready for collection',         // 2
        'Out for delivery',             // 3
        'Collected',                    // 4
        'Delivered',                    // 5
        'Not collected',                // 6
        'Not delivered/Wrong address',  // 7
        'Cancelled by customer',        // 8
        'Rejected by butcher',          // 9
        'Refund Request',               // 10
        'Refund Issued',                // 11
    ];


    order_statuscontrol_color = [
        'bg-danger',
        'bg-orange',
        'bg-orange',
        'bg-orange',
        'bg-success',
        'bg-success',
        'bg-purple',
        'bg-purple',
        'bg-gray',
        'bg-gray',
        'bg-danger',
        'bg-success',
    ];

    rate_description = [
        'Poor',
        'Fair',
        'Good',
        'Very good',
        'Excellent'
    ];

    order_status_consts: any;

    constructor(
        private router: Router,
        public status_service: StatusService,
        public order_service: OrderService,
        private sse_service: SseService,
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
    ) {
        this.order = store.get('selected_order');
        this.user = store.get('user');
        this.order_status_consts = Constants.orderStatus;
        if (!this.order.rates) {
            this.order.rates = {
                quality: 1,
                service: 1,
                time: 1,
                fee: 1,
                experience: 1,
            };
        }
    }

    ngOnInit() {

    }

    getOrderStatus() {
        if (this.order) {
            return this.order_statuses[this.order.status];
        }
        return '';
    }

    getStatusBoxColor() {
        if (this.order) {
            return this.order_statuscontrol_color[this.order.status];
        }
        return '';
    }

    getOrderCustName() {
        let cust_name = '';
        cust_name += `${Constants.titles[this.user.title] || ''} `;
        cust_name += `${this.user.first_name} ${this.user.last_name}`;
        return cust_name;
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

    getStatusIcon() {
        if (this.order) {
            switch (this.order.status) {
                case Constants.orderStatus.AWAITING_CONFIRMATION:
                    return 'status_awaiting_confirm';
                case Constants.orderStatus.CONFIRMED_PREPARING:
                    return 'status_confirmed_preparing';
                case Constants.orderStatus.READY_COLLECTION:
                    return 'status_readyforcollection';
                case Constants.orderStatus.OUT_DELIVERY:
                    return 'status_outofdelivery';
                case Constants.orderStatus.COLLECTED:
                    return 'status_delivery_collected';
                case Constants.orderStatus.DELIVERED:
                    return 'status_delivery_collected';
                case Constants.orderStatus.NOT_COLLECTED:
                    return 'status_nodelivered_collected';
                case Constants.orderStatus.NOT_DELIVERY_WRONGADDRESS:
                    return 'status_nodelivered_collected';
                case Constants.orderStatus.CANCELLED_BYCUST:
                    return 'status_canceled';
                case Constants.orderStatus.REJECTED_BYBUT:
                    return 'status_rejected';
                default:
                    return 'status_awaiting_confirm';
            }
        }
    }

    getDate(date) {
        return moment(date).format('DD MMM HH:mm');
    }

    getButcherClosingTime() {
        let day = moment().day();
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        if (this.order.butcher && this.order.butcher.shop) {
            const day_setting = this.order.butcher.shop.day_settings[day];
            if (day_setting.open) {
                return `(${moment(day_setting.closing_time).format('HH:MM A')})`;
            }
        }
        return '';
    }

    getButcherShopCloseTime() {
        if (this.order && this.order.butcher) {

        }
    }

    isOrderInProcessing() {
        if (this.order.status !== Constants.orderStatus.CANCELLED_BYCUST &&
            this.order.status !== Constants.orderStatus.REJECTED_BYBUT &&
            this.order.status !== Constants.orderStatus.DELIVERED &&
            this.order.status !== Constants.orderStatus.COLLECTED) {
            return true;
        }
        return false;
    }

    isOrderCancelOrReject() {
        if (this.order.status === Constants.orderStatus.CANCELLED_BYCUST ||
            this.order.status === Constants.orderStatus.REJECTED_BYBUT) {
            return true;
        }
        return false;
    }

    isOrderCompleted() {
        if (this.order.status === Constants.orderStatus.DELIVERED ||
            this.order.status === Constants.orderStatus.COLLECTED) {
            return true;
        }
        return false;
    }

    displayOrderStatusDescription() {
        switch (this.order.status) {
            case Constants.orderStatus.AWAITING_CONFIRMATION:
                return `The butcher has your order and will confirm ${this.getOrderDeliveryLabel().toLowerCase()} time soon.`;
            case Constants.orderStatus.CONFIRMED_PREPARING:
                return `Your order has been confirmed by the butcher.
                 Expected ${this.getOrderDeliveryLabel().toLowerCase()} time is approximately
                 ${moment(this.order.delivery_date).add(this.order.but_confirm_delivery_time, 'minutes').format('HH:mm A')}`;
            case Constants.orderStatus.OUT_DELIVERY:
                return 'Great news! your order is out for delivery and will be with you soon.';
            case Constants.orderStatus.READY_COLLECTION:
                return `Great news! your order is ready for collection. Please collect is today before`;
            case Constants.orderStatus.CANCELLED_BYCUST:
                return `Sorry to hear, you have cancelled your order. Hope you will order from us soon!
                        You have not been charged for this order. If you have paid by card, your amount will be refunded.`;
            case Constants.orderStatus.REJECTED_BYBUT:
                return `Sorry, your order has been rejected by the butcher.
                        It could be that they are too busy or that they have closed.
                        You have not been charged for this order.
                        If you have paid by card, your amount will be refunded.`;
            case Constants.orderStatus.NOT_COLLECTED:
                if (this.order.delivery_option === 0) {
                    return `We have been notified by the butcher that your order is not collected.
                            Please contact the butcher for further assistance.`;
                }
                return `We have been notified by the butcher that your order is not delivered.
                        Please contact the butcher for further assistance.`;
            case Constants.orderStatus.NOT_DELIVERY_WRONGADDRESS:
                if (this.order.delivery_option === 0) {
                    return `We have been notified by the butcher that your order is not collected.
                            Please contact the butcher for further assistance.`;
                }
                return `We have been notified by the butcher that your order is not delivered.
                        Please contact the butcher for further assistance.`;
            case Constants.orderStatus.COLLECTED:
                return `Your Order has been marked as Collected`;
            case Constants.orderStatus.DELIVERED:
                return `Your Order has been marked as Delivered`;
        }
    }

    gotoSearch() {
        this.router.navigate(['/order/search']);
    }

    rateQuaityChange(event) {
        this.order.rates.quality = event.rating;
    }

    rateServiceChange(event) {
        this.order.rates.service = event.rating;
    }

    rateTimeChange(event) {
        this.order.rates.time = event.rating;
    }

    rateFeeChange(event) {
        this.order.rates.fee = event.rating;
    }

    rateExperienceChange(event) {
        this.order.rates.experience = event.rating;
    }

    submitRate() {
        const params = {
            order_id: this.order._id,
            rates: this.order.rates
        };
        this.spinner_service.show();
        this.order_service.rating(params).then(data => {
            this.spinner_service.hide();
            this.toaster.success('Rating success', 'Success');
            this.order.rated = true;
        }).catch(error => {
            this.spinner_service.hide();
            console.log(error);
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message);
            }
        });
    }
}
