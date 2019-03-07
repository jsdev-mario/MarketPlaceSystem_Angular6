import { Component, OnInit } from '@angular/core';
import { StatusService } from '../../service';
import Constant from '../../service/constant';
const store = require('store');

@Component({
    selector: 'app-aboutus',
    templateUrl: './aboutus.component.html',
    styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

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
