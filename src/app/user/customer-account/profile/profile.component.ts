import { Component, OnInit } from '@angular/core';
import Constant from '../../../service/constant';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { ValidationService, SpinnerService, CommonService, SiteInfoService, CustomerService } from '../../../service';
import { ToastrService, Toast } from 'ngx-toastr';

declare var require: any;
const store = require('store');

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    titles = [
        { id: 0, name: Constant.titles_label[0] },
        { id: 1, name: Constant.titles_label[1] },
        { id: 2, name: Constant.titles_label[2] },
        { id: 3, name: Constant.titles_label[3] },
        { id: 4, name: Constant.titles_label[4] },
    ];

    phone_mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/,
        /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

    title = 0;
    first_name: string;
    last_name: string;
    mobile_phone: string;
    email: string;
    email_news: boolean;
    order_sms: boolean;

    user: any;

    constructor(
        public validation: ValidationService,
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
        public customer_service: CustomerService,
    ) {
        this.user = store.get('user');
    }

    ngOnInit() {
        this.first_name = this.user.first_name;
        this.last_name = this.user.last_name;
        this.title = this.user.title;
        this.email = this.user.email;
        this.mobile_phone = this.user.mobile_phone;
        this.email_news = this.user.email_news;
        this.order_sms = this.user.order_sms;
        if (!this.email_news) {
            this.email_news = true;
        }
        if (!this.order_sms) {
            this.order_sms = true;
        }
    }

    profileSave() {
        if (!this.first_name || this.first_name === '') {
            this.toaster.error('Please input first name.', 'Error');
            return;
        }
        if (!this.email || this.email === '') {
            this.toaster.error('Please input email.', 'Error');
            return;
        }
        if (!this.mobile_phone || this.mobile_phone === '') {
            this.toaster.error('Please input mobile phone.', 'Error');
            return;
        }
        const param: any = {
            first_name: this.first_name,
            email: this.email,
            mobile_phone: this.mobile_phone,
            title: this.title,
            order_sms: this.order_sms,
            email_news: this.email_news,
        };
        if (this.last_name && this.last_name !== '') {
            param.last_name = this.last_name;
        }
        this.spinner_service.show();
        this.customer_service.updateProfile(param).then(data => {
            this.spinner_service.hide();
            if (data) {
                this.user = data;
                store.set('user', this.user);
                this.first_name = this.user.first_name;
                this.last_name = this.user.last_name;
                this.toaster.success('Profile Updated.', 'Success');
            }
        }).catch(error => {
            console.log(error);
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    displaySwitchLabel(flag) {
        if (flag) {
            return 'ON';
        } else {
            return 'OFF';
        }
    }
}
