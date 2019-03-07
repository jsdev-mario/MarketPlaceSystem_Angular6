import { Component, OnInit } from '@angular/core';
import Constant from '../../../service/constant';
import API_URL from '../../../service/api_url';
import { PaymentService, SpinnerService, OrderService, SiteInfoService } from '../../../service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

const store = require('store');
const moment = require('moment');
declare var $: any;
declare var require: any;

// const braintree = require('braintree-web');
declare var braintree: any;
declare var paypal: any;

@Component({
    selector: 'app-placeorder',
    templateUrl: './placeorder.component.html',
    styleUrls: ['./placeorder.component.css']
})
export class PlaceorderComponent implements OnInit {

    user: any;

    client_token: string;
    paypal_account: any;
    paypalcredit_account: any;
    can_paypal: boolean;
    service_charge: number;
    site_info: any;

    constructor(
        public payment_service: PaymentService,
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
        public order_service: OrderService,
        public router: Router,
        public siteinfo_service: SiteInfoService,
    ) {
        this.user = store.get('user');
    }

    ngOnInit() {
        // this.order_service.current_order.payment_method = 0;
        if (store.get('site_info')) {
            this.site_info = store.get('site_info');
            // this.order_service.current_order.service_charge = this.site_info.payment_settings.card_charge;
            // this.order_service.current_order.total_price =
            // this.order_service.getSubTotalPrice() + this.order_service.current_order.service_charge;
        }
        this.initCheckOut();
    }

    initCheckOut() {
        this.spinner_service.show();
        this.payment_service.getClientToken().then(token => {
            this.client_token = token;
            this.spinner_service.hide();
            this.initCardUi();
        }).catch(error => {
            this.spinner_service.hide();
            console.log(error);
        });
    }

    initCardUi() {

        console.log('this is init ui');
        const submitButton = document.querySelector('#card_btn');
        braintree.dropin.create({
            authorization: this.client_token,
            selector: '#dropin-container'
        }, function (err, dropinInstance) {
            if (err) {
                // Handle any errors that might've occurred when creating Drop-in
                console.error(err);
                return;
            }
            submitButton.addEventListener('click', function () {
                dropinInstance.requestPaymentMethod(function (err, payload) {
                    if (err) {
                        // Handle errors in requesting payment method
                    }

                    // Send payload.nonce to your server
                });
            });
        });
    }

    placeMyOrder() {
        if (this.order_service.current_order.payment_method === undefined) {
            this.toaster.error('Please select payment method', 'Error');
            return;
        }
        console.log(this.order_service.current_order);
        const order = this.order_service.current_order;
        const order_items = [];
        let sub_price = 0.0;
        order.order_items.forEach(order_item => {
            const choices = [];
            order_item.choices.forEach(choice => {
                choices.push({
                    name: choice.name,
                    price: choice.price,
                });
            });
            sub_price += order_item.sub_price;
            order_items.push({
                product: {
                    subcategory: order_item.product.subcategory._id,
                    name: order_item.product.subcategory.name,
                    price: order_item.product.price,
                    qty: order_item.product.qty,
                    unit: order_item.product.unit,
                    description: order_item.product.description,
                    offer: order_item.product.offer,
                },
                count: order_item.count,
                has_save: order_item.has_save || false,
                save_price: order_item.save_price,
                sub_price: order_item.sub_price,
                choices: choices,
            });
        });
        const param: any = {
            order: {
                butcher: order.butcher._id,
                customer: {
                    email: order.user.email,
                    first_name: order.user.first_name,
                    last_name: order.user.last_name,
                    mobile_phone: order.user.mobile_phone,
                    ref_id: order.user._id
                },
                email_news: order.user.email_news,
                order_sms: order.user.order_sms,
                order_items: order_items,
                delivery_option: order.delivery_option,
                delivery_date: order.delivery_date,
                delivery_date_type: order.delivery_date_type, //
                note: order.note,
                payment_method: order.payment_method,
                save_price: order.save_price,
                delivery_fee: order.delivery_fee || 0.0,
                service_charge: order.service_charge || 0.0,
                sub_price: sub_price,
                total_price: sub_price + (order.delivery_fee || 0.0) + (order.service_charge || 0.0),
            }
        };

        if (param.order.delivery_option === Constant.deliveryType.DELIVERY && order.delivery_address) {
            param.order.delivery_address = {
                address_name: order.delivery_address.address_name,
                address_line1: order.delivery_address.address_line1,
                address_line2: order.delivery_address.address_line2,
                city: order.delivery_address.city,
                location: order.delivery_address.location,
                post_code: order.delivery_address.post_code,
                ref_id: order.delivery_address._id,
            };
        }

        console.log(param);

        this.spinner_service.show();
        this.order_service.placeOrder(param).then(data => {
            this.spinner_service.hide();
            this.toaster.success('Order success', 'Success');
        }).catch(error => {
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
            console.log(error);
        });
    }

    selectPaymentMethod(index) {
        this.order_service.current_order.payment_method = index;
        if (index === 0) {
            this.order_service.current_order.service_charge = this.site_info.payment_settings.card_charge;
        } else if (index === 1) {
            this.order_service.current_order.service_charge = this.site_info.payment_settings.card_charge;
        } else {
            this.order_service.current_order.service_charge = this.site_info.payment_settings.cash_charge;
        }
    }

    getDeliveryOptionLabel() {
        if (this.order_service.current_order.delivery_option === 1) {
            return 'Delivery';
        } else {
            return 'Collection';
        }
    }

    deliveryDateTimeInfo() {
        if (this.order_service.current_order.delivery_date) {
            return `Estimated Delivery time: ${moment(this.order_service.current_order.delivery_date).format('ddd, DD MMM')},
             Approximately ${moment(this.order_service.current_order.delivery_date).format('HH:mm A')} `;
        }
        return '';
    }

    collectionDateTimeInfo() {
        if (this.order_service.current_order.delivery_date) {
            return `Estimated Collection time: ${moment(this.order_service.current_order.delivery_date).format('ddd, DD MMM')}
            at ${moment(this.order_service.current_order.delivery_date).format('HH:mm A')} `;
        }
        return '';
    }

    paypalAccountDelete() {
        this.paypal_account = undefined;
        $('#paypal-button').css('display', 'block');
    }

    paypalCreditAccountDelete() {
        this.paypalcredit_account = undefined;
        $('#paypalcredit-button').css('display', 'block');
    }

}
