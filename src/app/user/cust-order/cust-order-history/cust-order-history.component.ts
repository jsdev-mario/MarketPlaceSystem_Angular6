import { Component, OnInit, OnDestroy } from '@angular/core';
import Constants from '../../../service/constant';
import {
    SpinnerService, OrderService,
    SiteInfoService, SocketService, SseService,
    StatusService, CommonService, ValidationService
} from '../../../service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import API_URL from '../../../service/api_url';


const store = require('store');
const moment = require('moment');
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-cust-order-history',
    templateUrl: './cust-order-history.component.html',
    styleUrls: ['./cust-order-history.component.css']
})
export class CustOrderHistoryComponent implements OnInit {

    user: any;
    total_orders = [];
    filtered_orders = [];
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

    ordst_select_datas = [];
    search_status = -1;
    search_from_date: Date;
    search_to_date: Date;
    search_but_name = '';
    search_but_postcode = '';
    search_order_id: string;

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
        public validation: ValidationService,
    ) {
        this.user = store.get('user');
        this.countperpage = this.countperpages[0];
        this.ordst_select_datas = [{
            id: -1,
            name: 'ALL'
        }];
        let index = 0;
        this.order_statuses.forEach(status => {
            this.ordst_select_datas.push({
                id: index,
                name: status,
            });
            index++;
        });
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
        };
        this.spinner_service.show();
        this.order_service.getCustomerOrdersInfo({}).then(info_data => {
            this.initOrdersInfo(info_data);
            this.order_service.getCustomerOrders(param).then(data => {
                this.spinner_service.hide();
                this.total_orders = [];
                this.filtered_orders = [];
                this.page_orders = [];
                this.total_orders = data;
                this.filtered_orders = this.total_orders;
                this.page_orders = this.filtered_orders.slice(0, this.countperpage);
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

    onChangeSearchFromDate(value: Date) {
        this.search_from_date = value;
    }

    onChangeSearchToDate(value: Date) {
        this.search_to_date = value;
    }

    onInputOrderID(event) {
        if (event.target.value === '') {
            this.search_order_id = undefined;
            this.filtered_orders = this.total_orders;
            this.page_orders = this.filtered_orders.slice(0, this.countperpage);
            this.current_page = 1;
        } else {
            this.search_but_name = '';
            this.search_but_postcode = '';
            this.search_to_date = undefined;
            this.search_from_date = undefined;
            this.search_status = -1;
        }
    }

    search() {
        this.filtered_orders = [];
        if (this.search_order_id) {
            this.total_orders.forEach(order => {
                if (order.order_id.toLowerCase().indexOf(this.search_order_id.toLowerCase()) > -1) {
                    this.filtered_orders.push(order);
                }
            });
            this.page_orders = this.filtered_orders.slice(0, this.countperpage);
            this.current_page = 1;
            return;
        }
        const temp_order_datas = [];
        this.total_orders.forEach(order => {
            if ((this.getOrderButName(order).toLowerCase().replace(' ', '')
                .indexOf(this.search_but_name.toLowerCase().replace(' ', '')) > -1) &&
                (this.getOrderButPostCode(order).toLowerCase().replace(' ', '')
                    .indexOf(this.search_but_postcode.toLowerCase().replace(' ', '')) > -1)) {
                temp_order_datas.push(order);
            }
        });
        const temp1_order_datas = [];
        temp_order_datas.forEach(order => {
            if (this.search_status < 0 || this.search_status === order.status) {
                temp1_order_datas.push(order);
            }
        });
        const temp2_order_datas = [];
        temp1_order_datas.forEach(order => {
            if (this.search_from_date && this.search_to_date) {
                if (moment(order.createdAt) >= moment(this.search_from_date).startOf('day')
                    && moment(order.createdAt) <= moment(this.search_to_date).endOf('day')) {
                    temp2_order_datas.push(order);
                }
            } else if (this.search_from_date) {
                if (moment(order.createdAt) >= moment(this.search_from_date).startOf('day')) {
                    temp2_order_datas.push(order);
                }
            } else if (this.search_to_date) {
                if (moment(order.createdAt) <= moment(this.search_to_date).endOf('day')) {
                    temp2_order_datas.push(order);
                }
            } else {
                temp2_order_datas.push(order);
            }
        });
        this.filtered_orders = temp2_order_datas;
        this.page_orders = this.filtered_orders.slice(0, this.countperpage);
        this.current_page = 1;
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

    gotoOrderView(order) {
        store.set('selected_order', order);
        this.router.navigate(['user/orderview', order.order_id]);
    }

    pageChanged(event) {
        this.current_page = event.page;
        this.page_orders = this.filtered_orders.slice(this.countperpage * (this.current_page - 1),
            (this.countperpage * (this.current_page - 1) + this.countperpage));
    }

    countPerPageChange(event) {
        this.page_orders = this.filtered_orders.slice(this.countperpage * (this.current_page - 1),
            (this.countperpage * (this.current_page - 1) + this.countperpage));
    }

    /*** donw load csv and pdf */

    downloadCSV() {
        const orders_data = [];
        let index = 0;
        this.filtered_orders.forEach(order => {
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
        const file_name = `Orders(${this.getTodayDateTime()})`;
        this.common_service.saveCSV(orders_data, file_name);
    }

    downloadPDF() {
        const orders_data = [];
        let index = 0;
        this.filtered_orders.forEach(order => {
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
        const doc_title = 'Orders History';
        const file_name = `Orders(${this.getTodayDateTime()})`;
        this.common_service.saveCustomerPDF(orders_data, doc_title, file_name);
    }
}
