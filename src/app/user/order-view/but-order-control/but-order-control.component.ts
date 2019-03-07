import { Component, OnInit } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { StatusService, OrderService, SpinnerService } from '../../../service';
import Constants from '../../../service/constant';
import { ToastrService } from 'ngx-toastr';

declare var require: any;
declare var $: any;
const store = require('store');

import * as moment from 'moment';


@Component({
    selector: 'app-but-order-control',
    templateUrl: './but-order-control.component.html',
    styleUrls: ['./but-order-control.component.css']
})
export class ButOrderControlComponent implements OnInit {

    order: any;
    user: any;

    priceMask = createNumberMask({
        prefix: '£ ',
        allowDecimal: true,
        includeThousandsSeparator: false,
    });

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

    order_status_icons = [
        'fa fa-pull-left fa-bell color-danger',
        'fa fa-pull-left fa-thumbs-up color-orange',
        'fa fa-pull-left fa-shopping-basket color-orange',
        'fa fa-pull-left fa-shipping-fast color-orange',
        'fa fa-pull-left fa-check color-success',
        'fa fa-pull-left fa-check color-success',
        'fa fa-pull-left fa-ban color-purple',
        'fa fa-pull-left fa-ban color-purple',
        'fa fa-pull-left fa-user-times color-gray',
        'fa fa-pull-left fa-times color-gray',
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


    order_control_actions = [];
    delivery_estimes = [];
    new_status: number;
    confirm_delivery_time = 0;
    note = '';
    refund_note: '';
    refund_amount: 0;

    order_status_consts: any;


    constructor(
        public status_service: StatusService,
        public order_service: OrderService,
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
    ) {
        this.order = store.get('selected_order');
        this.user = store.get('user');
        this.order_status_consts = Constants.orderStatus;
        this.generateOrderControlAction();
        this.generateDeliveryTime();
    }

    ngOnInit() {

    }

    getOrderStatus() {
        if (this.order) {
            return this.order_statuses[this.order.status];
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

    canDisplayUpdateStatus() {
        if (this.order.status === Constants.orderStatus.DELIVERED ||
            this.order.status === Constants.orderStatus.COLLECTED) {
            return false;
        }
        return true;
    }

    canDisplayRefundSection() {
        if (this.order.refund && this.order.refund.requser_type) {
            return false;
        }
        if (this.order && this.order.payment_method !== Constants.paymentMethod.CASH) {
            if (this.order.status === Constants.orderStatus.DELIVERED ||
                this.order.status === Constants.orderStatus.COLLECTED ||
                this.order.status === Constants.orderStatus.NOT_COLLECTED ||
                this.order.status === Constants.orderStatus.NOT_DELIVERY_WRONGADDRESS) {
                return true;
            }
        }
        return false;
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

    generateOrderControlAction() {
        if (this.order) {
            switch (this.order.status) {
                case Constants.orderStatus.AWAITING_CONFIRMATION:
                    this.order_control_actions = [
                        { id: 1, name: this.order_statuses[1] },
                        { id: 8, name: this.order_statuses[8] },
                        { id: 9, name: this.order_statuses[9] },
                    ];
                    this.new_status = Constants.orderStatus.CONFIRMED_PREPARING;
                    break;
                case Constants.orderStatus.CONFIRMED_PREPARING:
                    if (this.order.delivery_option === Constants.deliveryType.COLLECTION) {
                        this.order_control_actions = [
                            { id: 2, name: this.order_statuses[2] },
                            { id: 4, name: this.order_statuses[4] },
                            { id: 6, name: this.order_statuses[6] },
                            { id: 8, name: this.order_statuses[8] },
                            { id: 9, name: this.order_statuses[9] },
                        ];
                        this.new_status = Constants.orderStatus.READY_COLLECTION;
                    } else {
                        this.order_control_actions = [
                            { id: 3, name: this.order_statuses[3] },
                            { id: 5, name: this.order_statuses[5] },
                            { id: 7, name: this.order_statuses[7] },
                            { id: 8, name: this.order_statuses[8] },
                            { id: 9, name: this.order_statuses[9] },
                        ];
                        this.new_status = Constants.orderStatus.OUT_DELIVERY;
                    }
                    break;
                case Constants.orderStatus.READY_COLLECTION:
                    this.order_control_actions = [
                        { id: 4, name: this.order_statuses[4] },
                        { id: 6, name: this.order_statuses[6] },
                    ];
                    this.new_status = Constants.orderStatus.COLLECTED;
                    break;
                case Constants.orderStatus.OUT_DELIVERY:
                    this.order_control_actions = [
                        { id: 5, name: this.order_statuses[5] },
                        { id: 7, name: this.order_statuses[7] },
                    ];
                    this.new_status = Constants.orderStatus.DELIVERED;
                    break;
                case Constants.orderStatus.NOT_COLLECTED:
                    this.order_control_actions = [
                        { id: 4, name: this.order_statuses[4] },
                    ];
                    this.new_status = Constants.orderStatus.COLLECTED;
                    break;
                case Constants.orderStatus.NOT_DELIVERY_WRONGADDRESS:
                    this.order_control_actions = [
                        { id: 5, name: this.order_statuses[5] },
                    ];
                    this.new_status = Constants.orderStatus.DELIVERED;
                    break;
                default:
                    this.order_control_actions = [
                        { id: 1, name: this.order_statuses[1] },
                        { id: 8, name: this.order_statuses[8] },
                        { id: 9, name: this.order_statuses[9] },
                    ];
                    this.new_status = Constants.orderStatus.CONFIRMED_PREPARING;
                    break;

            }
        }
    }

    generateDeliveryTime() {
        this.delivery_estimes = [];
        const es_time = this.order.delivery_option === 1 ? this.user.shop.delivery_time : this.user.shop.collection_time;
        const delivery_time = moment(this.order.delivery_date);
        for (let i = 0; i <= es_time; i += 5) {
            this.delivery_estimes.push({
                id: i,
                name: i === 0 ? `${delivery_time.format('HH:mm A')} ASAP` : `+ ${i} mins`,
            });
        }
        this.confirm_delivery_time = 0;
    }

    getDate(date) {
        return moment(date).format('DD MMM HH:mm');
    }

    getHistoryDescription(history) {
        switch (history.status) {
            case Constants.orderStatus.AWAITING_CONFIRMATION: {
                if (this.order.payment_method === Constants.paymentMethod.CARD) {
                    return 'Payment paid by card';
                } else if (this.order.payment_method === Constants.paymentMethod.PAYPAL) {
                    return 'Payment paid by paypal';
                } else {
                    return 'Cash payment is due';
                }
            }
            case Constants.orderStatus.CONFIRMED_PREPARING:
                if (this.order.but_confirm_delivery_time === 0) {
                    return `Order has been confirmed by the butcher. Butcher hasn't added time
                     to the ${this.getOrderDeliveryLabel().toLocaleLowerCase()} time`;
                }
                return `Order has been confirmed by the butcher. Butcher has added +${this.order.but_confirm_delivery_time}
                 mins to the ${this.getOrderDeliveryLabel().toLocaleLowerCase()} time`;
            case Constants.orderStatus.READY_COLLECTION:
                return `Order is ${this.order_statuses[history.status]}`;
            case Constants.orderStatus.OUT_DELIVERY:
                return `Order is ${this.order_statuses[history.status]}`;
            case Constants.orderStatus.COLLECTED:
                return `Order is ${this.order_statuses[history.status]}`;
            case Constants.orderStatus.DELIVERED:
                return `Order is ${this.order_statuses[history.status]}`;
            case Constants.orderStatus.NOT_COLLECTED:
                return `Order is ${this.order_statuses[history.status]}`;
            case Constants.orderStatus.NOT_DELIVERY_WRONGADDRESS:
                return `Order is ${this.order_statuses[history.status]}`;
            case Constants.orderStatus.CANCELLED_BYCUST:
                if (this.order.payment_method !== Constants.paymentMethod.CASH) {
                    return `Full refund of £ ${this.order.sub_price} will be issued`;
                }
                return 'Customer has not been charged';
            case Constants.orderStatus.REJECTED_BYBUT:
                if (this.order.payment_method !== Constants.paymentMethod.CASH) {
                    return `Full refund of £ ${this.order.sub_price} will be issued`;
                }
                return 'Customer has not been charged';
            case Constants.orderStatus.REFUND_REQUEST:
                return `Refund Amount: £ ${history.refund_amount.toFixed(2)}, Order Total: £ ${this.order.sub_price.toFixed(2)}`;
            case Constants.orderStatus.REFUND_PROCESSED:
                if (this.order.sub_price === history.refund_amount) {
                    return `Full refund of £ ${history.refund_amount.toFixed(2)} was issued`;
                }
                return `Refund Amount: £ ${history.refund_amount.toFixed(2)}, Order Total: £ ${this.order.sub_price.toFixed(2)}`;
        }
    }

    updateStatus() {
        const param: any = {
            order_id: this.order._id,
            status: this.new_status,
            note: this.note !== '' ? this.note : undefined,
        };
        if (this.new_status === Constants.orderStatus.CONFIRMED_PREPARING) {
            param.but_confirm_delivery_time = this.confirm_delivery_time;
        }
        this.spinner_service.show();
        this.order_service.updateStatus(param).then(data => {
            this.spinner_service.hide();
            this.order = data;
            this.status_service.events.emit({
                message: Constants.eventNames.UPDATE_ORDER_STATUS,
                data: this.order,
            });
            this.toaster.success('Order status updated', 'Success');
            this.note = '';
            this.generateOrderControlAction();
            store.set('selected_order', this.order);
        }).catch(error => {
            this.spinner_service.hide();
            console.log(error);
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message);
            }
        });
    }

    displayMenuName(product) {
        let menu_name = product.subcategory.name + ' - ';
        if (this.unit(product) !== 'Each') {
            menu_name += `${product.qty} `;
        }
        return menu_name + `${this.unit(product)}`;
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

    displayPreorderModal() {
        $(document).ready(() => {
            $('#preorder_modal').modal('show');
        });
    }

    preorderCheckItem(order_item) {
        order_item.prepare_order = !order_item.prepare_order;
        store.set('selected_order', this.order);
    }

    refundRequest() {
        if (this.refund_amount === undefined || String(this.refund_amount) === '' || this.refund_amount === 0) {
            this.toaster.error('Please input refund amount.', 'Error');
            return;
        }
        if (this.refund_amount > this.order.sub_price) {
            this.toaster.error('Invalid Refund amount.', 'Error');
            return;
        }
        if (this.refund_note === undefined || this.refund_note === '') {
            this.toaster.error('Please input refund note.', 'Error');
            return;
        }
        const params = {
            order_id: this.order._id,
            requser_type: this.user.user_type,
            amount: this.refund_amount,
            refund_note: this.refund_note,
        };
        this.spinner_service.show();
        this.order_service.sendRefundRequest(params)
            .then(data => {
                console.log(data);
                this.spinner_service.hide();
                this.toaster.success('Refund request success', 'Success');
                this.order = data;
                store.set('selected_order', this.order);
            }).catch(error => {
                this.spinner_service.hide();
                if (error.error && error.error.message) {
                    this.toaster.error(error.error.message, 'Error');
                }
            });
    }

    numberFormat(event) {
        if (event.target.value === '') {
            return 0;
        }
        let value = 0;
        if (event.target.value.indexOf('£') > -1) {
            value = Number(event.target.value.split('£ ')[1]);
        }
        return value;
    }
}
