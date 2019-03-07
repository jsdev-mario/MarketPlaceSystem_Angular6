import { Component, OnInit } from '@angular/core';
import { StatusService } from '../../service';
import Constant from '../../service/constant';
const store = require('store');

@Component({
    selector: 'app-policy',
    templateUrl: './policy.component.html',
    styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {

    constructor(
        public status_service: StatusService
    ) {
        this.status_service.fast_search = true;
        const user = store.get('user');
        if (user && user.user_type === Constant.userType.BUTCHER) {
            this.status_service.fast_search = false;
        }
    }


    ngOnInit() {
    }

}
