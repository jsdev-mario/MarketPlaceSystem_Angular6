import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service';
const store = require('store');
declare var require: any;

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {

    user: any;

    constructor(
        public order_service: OrderService
    ) {
        this.user = store.get('user');
        this.order_service.current_order = store.get('current_order');
        if (this.order_service.current_order.delivery_option === 0) {
            this.order_service.current_order.user = this.user;
            this.order_service.current_order.delivery_address = this.user.delivery_addresses[0];
            store.set('current_order', this.order_service.current_order);
        }
    }

    ngOnInit() {
    }
}
