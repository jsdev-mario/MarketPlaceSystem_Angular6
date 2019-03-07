import { Component, OnInit, OnDestroy } from '@angular/core';
import Constants from '../../service/constant';
import { SpinnerService, OrderService, SiteInfoService, SocketService, StatusService, CommonService } from '../../service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';


const store = require('store');
const moment = require('moment');
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-order-view',
    templateUrl: './order-view.component.html',
    styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit, OnDestroy {

    user: any;
    routersub: any;
    order: any;


    constructor(
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
        public order_service: OrderService,
        public router: Router,
        public active_router: ActivatedRoute,
        public siteinfo_service: SiteInfoService,
        public socket_service: SocketService,
        public status_service: StatusService,
        private common_service: CommonService,
    ) {
        this.user = store.get('user');
        this.order = store.get('selected_order');
        this.status_service.events.emit({
            message: Constants.eventNames.HEADER_STYLE,
            header_style: 2
        });
        this.routersub = this.active_router.params.subscribe(params => {
            if (this.order.order_id !== String(params['order_id'])) {
                if (this.isButcher()) {
                    this.router.navigate(['/user/buttodayorder']);
                } else {
                    this.router.navigate(['/user/custtodayorder']);
                }
            }
        });
    }

    ngOnInit() {

    }

    isButcher() {
        if (this.user && this.user.user_type === Constants.userType.BUTCHER) {
            return true;
        }
        return false;
    }

    ngOnDestroy() {
        this.routersub.unsubscribe();
    }
}
