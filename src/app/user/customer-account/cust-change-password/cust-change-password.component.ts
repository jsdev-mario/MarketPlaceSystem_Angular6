import { Component, OnInit } from '@angular/core';
import Constant from '../../../service/constant';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { ValidationService, SpinnerService, CommonService, SiteInfoService, CustomerService } from '../../../service';
import { ToastrService, Toast } from 'ngx-toastr';

declare var require: any;
const store = require('store');


@Component({
    selector: 'app-cust-change-password',
    templateUrl: './cust-change-password.component.html',
    styleUrls: ['./cust-change-password.component.css']
})
export class CustChangePasswordComponent implements OnInit {

    user: any;

    old_pass: string;
    new_pass: string;
    confirm_pass: string;

    show_confirmpass = false;
    show_oldpass = false;
    show_newpass = false;

    constructor(
        public validation: ValidationService,
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
        public cust_service: CustomerService,
        public common_service: CommonService,
    ) {
        this.user = store.get('user');
    }

    ngOnInit() {

    }

    changePass() {
        if (!this.old_pass || this.old_pass === '') {
            this.toaster.error('Please input old password', 'Error');
            return;
        }
        if (!this.new_pass || this.new_pass === '') {
            this.toaster.error('Please input new password', 'Error');
            return;
        }
        if (this.new_pass.length < 8 || !this.validation.passwordValidate(this.new_pass)) {
            this.toaster.error('Password must be at least 8 characters long.\r\n(Please include letters and numbers)', 'Error');
            return;
        }
        if (!this.confirm_pass || this.confirm_pass === '') {
            this.toaster.error('Please input confirm new password', 'Error');
            return;
        }
        this.spinner_service.show();
        this.cust_service.changePassword(this.new_pass).then(data => {
            this.spinner_service.hide();
            this.toaster.success('Password changed', 'Success');
        }).catch(error => {
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    oldPassInputType() {
        if (this.show_oldpass) {
            return 'text';
        } else {
            return 'password';
        }
    }

    newPassInputType() {
        if (this.show_newpass) {
            return 'text';
        } else {
            return 'password';
        }
    }

    confirmPassInputType() {
        if (this.show_confirmpass) {
            return 'text';
        } else {
            return 'password';
        }
    }

}
