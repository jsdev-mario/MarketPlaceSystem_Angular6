import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Constants from '../service/constant';
declare var require: any;
const store = require('store');


@Component({
    selector: 'app-weare',
    templateUrl: './weare.component.html',
    styleUrls: ['./weare.component.css']
})
export class WeareComponent implements OnInit, AfterContentChecked {

    user: any;

    constructor(
        public router: Router,
    ) {
        this.user = store.get('user');
    }

    ngOnInit() {

    }

    ngAfterContentChecked() {
        this.user = store.get('user');
    }

    userType() {
        if (this.user === undefined) {
            return 0;
        } else {
            if (this.user.user_type === Constants.userType.CUSTOMER) {
                return 0;
            } else if (this.user.user_type === Constants.userType.BUTCHER) {
                return 1;
            }
        }
    }

}
