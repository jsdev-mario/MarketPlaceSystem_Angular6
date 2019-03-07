import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpinnerService, CustomerService, ButcherService, ValidationService } from '../../service';
import { ToastrService } from 'ngx-toastr';
import Constant from '../../service/constant';
import { JwtHelperService } from '@auth0/angular-jwt';

declare var require: any;
const store = require('store');

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    new_password: string;
    confirm_password: string;
    routersub: any;
    token: string;
    user_id: string;
    user_type: number;


    constructor(
        public spinner_service: SpinnerService,
        public customer_service: CustomerService,
        public butcher_service: ButcherService,
        public toaster: ToastrService,
        public validation: ValidationService,
        public active_router: ActivatedRoute,
        public router: Router,
    ) { }

    ngOnInit() {
        this.routersub = this.active_router.params.subscribe(params => {
            this.token = String(params['token']);
            this.checkToken();
        });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        this.routersub.unsubscribe();
    }

    checkToken() {
        if (!this.token) {
            this.toaster.error('Invalid token', 'Error');
            this.router.navigate(['/']);
            return;
        }
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(this.token);
        const isExpired = helper.isTokenExpired(this.token);
        if (isExpired || !decodedToken || decodedToken.user_id === undefined) {
            this.toaster.error('Invalid token', 'Error');
            this.router.navigate(['/']);
            return;
        } else {
            this.user_type = decodedToken.user_type;
            console.log(this.user_type);
        }
    }

    passChange() {
        if (!this.new_password || this.new_password === '') {
            this.toaster.error('Please input new password', 'Error');
            return;
        }

        if (this.new_password.length < 8 || !this.validation.passwordValidate(this.new_password)) {
            this.toaster.error('Password must be at least 8 characters long.\r\n(Please include letters and numbers)', 'Error');
            return;
        }

        if (!this.confirm_password || this.confirm_password === '') {
            this.toaster.error('Please input confirm password', 'Error');
            return;
        }

        if (this.new_password !== this.confirm_password) {
            this.toaster.error('Password don\'t match', 'Error');
            return;
        }

        if (!this.token) {
            this.toaster.error('Invalid token', 'Error');
            return;
        }

        if (this.user_type === Constant.userType.BUTCHER) {
            this.butcherChangePass();
        } else {
            this.customerChangePass();
        }
    }

    butcherChangePass() {
        this.spinner_service.show();
        store.set('token', this.token);
        this.butcher_service.changePassword(this.new_password).then(data => {
            this.spinner_service.hide();
            this.toaster.success('Password changed', 'Success');
            this.router.navigate(['/auth/login/customer']);
        }).catch(error => {
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    customerChangePass() {
        this.spinner_service.show();
        store.set('token', this.token);
        this.customer_service.changePassword(this.new_password).then(data => {
            this.spinner_service.hide();
            this.toaster.success('Password changed', 'Success');
            this.router.navigate(['/auth/login/butcher']);
        }).catch(error => {
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    cancel() {

    }
}
