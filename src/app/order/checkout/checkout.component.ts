import { Component, OnInit } from '@angular/core';
import Constant from '../../service/constant';
import API_URL from '../../service/api_url';
import { PaymentService, SpinnerService, OrderService } from '../../service';
import { ToastrService } from 'ngx-toastr';

const store = require('store');
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    constructor(
        public order_service: OrderService
    ) {
        this.order_service.current_order = store.get('current_order');
    }

    ngOnInit() {
    }
}
