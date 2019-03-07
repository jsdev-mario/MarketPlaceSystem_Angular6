import { Component, OnInit, OnDestroy } from '@angular/core';
import Constants from '../../../service/constant';
import {
    SpinnerService, OrderService,
    SiteInfoService, SocketService,
    SseService, StatusService, CommonService
} from '../../../service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import API_URL from '../..//../service/api_url';

const store = require('store');
const moment = require('moment');
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-cust-today-order',
    templateUrl: './cust-today-order.component.html',
    styleUrls: ['./cust-today-order.component.css']
})
export class CustTodayOrderComponent implements OnInit {
    user: any;
    total_orders = [];
    page_orders = [];
    countperpage = 3;
    current_page = 1;

    total_count = 0;
    await_confirm_count: 0;
    total_price = 0.0;
    cashpay_price = 0.0;
    cardpay_price = 0.0;
    paypalpay_price = 0.0;

    new_count = 0;

    payment_methods = ['PayPal', 'PayPal Card', 'Cash'];
    delivery_options = ['Delivery', 'Collection'];
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
    ];

    countperpages = [20, 50, 100];


    constructor(
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
        public order_service: OrderService,
        public router: Router,
        public siteinfo_service: SiteInfoService,
        public socket_service: SocketService,
        public status_service: StatusService,
        private common_service: CommonService,
    ) {
        this.user = store.get('user');
        this.countperpage = this.countperpages[0];
        this.status_service.events.emit({
            message: Constants.eventNames.HEADER_STYLE,
            header_style: 0
        });
    }

    ngOnInit() {
        this.initData();
    }

    initData() {
        const param = {
            cust_id: this.user._id,
            st_date: new Date(),
        };
        this.spinner_service.show();
        this.order_service.getCustomerOrdersInfo({ is_today: true }).then(info_data => {
            this.initOrdersInfo(info_data);
            this.order_service.getCustomerOrders(param).then(data => {
                this.spinner_service.hide();
                this.total_orders = [];
                this.page_orders = [];
                this.total_orders = data;
                this.page_orders = this.total_orders.slice(0, this.countperpage);
                this.current_page = 1;
            }).catch(error => {
                this.spinner_service.hide();
                if (error.error && error.error.message) {
                    this.toaster.error(error.error.message, 'Error');
                }
            });
        }).catch(error => {
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    initOrdersInfo(info_data) {
        this.total_count = info_data.total_count;
        this.total_price = info_data.total_price;
        this.await_confirm_count = info_data.await_confirm_count;
        this.paypalpay_price = info_data.paypal_paid_price;
        this.cardpay_price = info_data.card_paid_price;
        this.cashpay_price = info_data.cash_paid_price;
    }

    getTodayDateTime() {
        return moment().format('ddd, DD MMM YYYY');
    }

    getOrderDate(order) {
        return moment(order.createdAt).format('DD/MM/YYYY');
    }

    getOrderTime(order) {
        return moment(order.createdAt).format('HH:MM A');
    }

    getOrderButName(order) {
        return order.butcher.shop.shop_name;
    }

    getOrderButPostCode(order) {
        return order.butcher.shop.post_code;
    }

    getOrderPaymentMethod(order) {
        return this.payment_methods[order.payment_method];
    }

    getOrderDeliveryOption(order) {
        return this.delivery_options[order.delivery_option];
    }

    getOrderDeliveryFee(order) {
        return order.delivery_fee === 0.0 ? '-' : order.delivery_fee.toFixed(2);
    }

    getOrderStatus(order) {
        return this.order_statuses[order.status];
    }

    getDeliveryDateTime(order) {
        const date_time = moment(order.delivery_date).format('MM-DD-YYYY, HH:MM A');
        return order.delivery_date_type === 0 ? `${date_time} ASAP` : `${date_time} Pre order`;
    }

    getOrderStatusIcon(order) {
        return this.order_status_icons[order.status];
    }

    getControlColor(order) {
        return this.order_statuscontrol_color[order.status];
    }

    getDeliveryChargeColor(order) {
        if (Math.abs(order.refund_price) !== 0.0) {
            if (Math.abs(order.refund_price) === Math.abs(order.sub_price + order.delivery_fee)) {
                return 'color-danger';
            }
        }
    }

    getRefundColor(order) {
        if (Math.abs(order.refund_price) !== 0.0) {
            if (Math.abs(order.refund_price) < (order.sub_price + order.delivery_fee)) {
                return 'color-success';
            } else if (Math.abs(order.refund_price) === (order.sub_price + order.delivery_fee)) {
                return 'color-danger';
            }
        }
    }

    getSubPriceColor(order) {
        if (Math.abs(order.refund_price) !== 0.0) {
            if (Math.abs(order.refund_price) < (order.sub_price + order.delivery_fee)) {
                return 'color-success';
            } else if (Math.abs(order.refund_price) === (order.sub_price + order.delivery_fee)) {
                if (order.status !== Constants.orderStatus.CANCELLED_BYCUST) {
                    return 'color-danger';
                }
            }
        }
    }

    pageChanged(event) {
        this.current_page = event.page;
        this.page_orders = this.total_orders.slice(this.countperpage * (this.current_page - 1),
            (this.countperpage * (this.current_page - 1) + this.countperpage));
    }

    countPerPageChange(event) {
        this.page_orders = this.total_orders.slice(this.countperpage * (this.current_page - 1),
            (this.countperpage * (this.current_page - 1) + this.countperpage));
    }

    /*** donw load csv and pdf */

    downloadCSV() {
        const orders_data = [];
        let index = 0;
        this.total_orders.forEach(order => {
            orders_data.push({
                'No': index,
                'Order ID': order.order_id,
                'Date': this.getOrderDate(order),
                'Order Time': this.getOrderTime(order),
                'Butcher Name': this.getOrderButName(order),
                'Butcher PostCode': this.getOrderButPostCode(order),
                'Payment Type': this.getOrderPaymentMethod(order),
                'Order Type': `${this.getOrderDeliveryOption(order)} (${this.getDeliveryDateTime(order).replace(',', ' ')})`,
                'Sub Total': Number(order.sub_price).toFixed(2),
                'Delivery Charges': this.getOrderDeliveryFee(order),
                'Refund': (Number(order.refund_price) || 0.0).toFixed(2),
                'Total': Number(order.sub_price + order.delivery_fee + order.refund_price).toFixed(2),
                'Status': this.getOrderStatus(order)
            });
            index++;
        });
        const file_name = `today_orders(${this.getTodayDateTime()})`;
        this.common_service.saveCSV(orders_data, file_name);
    }

    downloadPDF() {
        const orders_data = [];
        let index = 0;
        this.total_orders.forEach(order => {
            orders_data.push({
                'No': index,
                'Order ID': order.order_id,
                'Date': this.getOrderDate(order),
                'Order Time': this.getOrderTime(order),
                'Butcher Name': this.getOrderButName(order),
                'Butcher PostCode': this.getOrderButPostCode(order),
                'Payment Type': this.getOrderPaymentMethod(order),
                'Order Type': `${this.getOrderDeliveryOption(order)} (${this.getDeliveryDateTime(order).replace(',', ' ')})`,
                'Sub Total': Number(order.sub_price).toFixed(2),
                'Delivery Charges': this.getOrderDeliveryFee(order),
                'Refund': (Number(order.refund_price) || 0.0).toFixed(2),
                'Total': Number(order.sub_price + order.delivery_fee + order.refund_price).toFixed(2),
                'Status': this.getOrderStatus(order)
            });
            index++;
        });
        const doc_title = 'Today Orders';
        const file_name = `today_orders(${this.getTodayDateTime()})`;
        this.common_service.saveCustomerPDF(orders_data, doc_title, file_name);
    }

    gotoOrderView(order) {
        store.set('selected_order', order);
        this.router.navigate(['user/orderview', order.order_id]);
    }

}
