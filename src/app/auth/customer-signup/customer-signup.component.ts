import { Component, OnInit } from '@angular/core';
import { SpinnerService, ValidationService, SysAuthService, SearchService } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import Constant from '../../service/constant';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../service';
declare var require: any;
declare var $: any;
const store = require('store');


@Component({
    selector: 'app-customer-signup',
    templateUrl: './customer-signup.component.html',
    styleUrls: ['./customer-signup.component.css']
})
export class CustomerSignupComponent implements OnInit {

    email: string;
    password: string;
    policy = false;
    post_code: string;

    return_url: string;

    show_pass = false;

    constructor(
        private auth_service: SysAuthService,
        public active_router: ActivatedRoute,
        public spinner_service: SpinnerService,
        public search_service: SearchService,
        private router: Router,
        public validation: ValidationService,
        public toaster: ToastrService,
        public common_service: CommonService,
    ) { }

    ngOnInit() {
        this.return_url = this.active_router.snapshot.queryParams['returnUrl'];
        this.post_code = this.search_service.post_code || store.get('search_postcode');
    }

    policyClick(event) {
        if (!this.policy) {
            $(document).ready(() => {
                $('#pdlg_btn').click();
            });
            this.policy = false;
            event.target.checked = false;
        } else {
            this.policy = false;
        }
    }

    passInputType() {
        if (this.show_pass) {
            return 'text';
        } else {
            return 'password';
        }
    }

    poscodeFocuse() {
        if (this.post_code && this.post_code !== '') {
            $(document).ready(() => {
                $('#post_code').addClass('mt-success-input');
            });
        }
    }

    poscodeFocuseOut() {
        if (!this.post_code || this.post_code === '') {
            console.log(0);
            $(document).ready(() => {
                $('#post_code').removeClass('mt-danger-input');
                $('#post_code').addClass('mt-input');
            });
        }
    }


    facebookSignUp() {

    }

    validationPassword() {
        for (let i = 0; i < this.password.length; i++) {
            if (this.isNumber(this.password[i])) {
                return true;
            }
        }
        return false;
    }

    isNumber(string) {
        return !isNaN(parseFloat(string)) && isFinite(string);
    }

    signUp() {
        if (this.validation.textValueValidate(this.email) <= 0) {
            this.toaster.error('Ivalid email.', 'Error');
            return;
        }
        if (!this.password || this.password === '') {
            this.toaster.error('Password input password', 'Error');
            return;
        }
        if (this.password.length < 8 || !this.validationPassword()) {
            this.toaster.error('Password must be at least 8 characters long.\r\n(Please include letters and numbers)', 'Error');
            return;
        }

        if (!this.policy) {
            this.toaster.error('Please accept the terms and conditions', 'Error');
            return;
        }
        const param: any = {
            user_type: Constant.userType.CUSTOMER,
            user_role: Constant.userRole.customer.CUSTOMER,
            email: this.email,
            password: this.password,
        };
        this.spinner_service.show();
        if (this.post_code) {
            if (this.post_code === '') {
                this.toaster.error('Invalid post code', 'Error');
                return;
            }
            this.common_service.getNearestAddress(this.post_code).then(data => {
                if (data.data.length > 0 && data.default_location) {
                    param.post_code = this.post_code;
                    console.log(data.data[0].geometry);
                    param.location = {
                        latitude: data.data[0].geometry.location.lat,
                        longitude: data.data[0].geometry.location.lng,
                    };
                    param.address_line1 = data.data[0].name;
                    this.signUpProcess(param);
                }
            }).catch(error => {
                this.spinner_service.hide();
                $(document).ready(() => {
                    $('#post_code').removeClass('mt-success-input');
                    $('#post_code').addClass('mt-danger-input');
                });
                this.toaster.error('Invalid post code', 'Error');
            });
        } else {
            this.signUpProcess(param);
        }
    }

    signUpProcess(param) {
        this.auth_service.custSignUp(param).then(data => {
            this.spinner_service.hide();
            store.set('user', data['data']);
            store.set('token', data['token']);
            this.toaster.success('Signup sccess.', 'Success');
            this.router.navigate([this.return_url || '/order/search']);
        }).catch(error => {
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }
}
