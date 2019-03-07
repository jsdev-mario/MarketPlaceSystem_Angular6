import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButcherService, SpinnerService, ValidationService, SysAuthService, CustomerService } from '../../service';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import Constant from '../../service/constant';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import {
    FacebookLoginProvider,
    GoogleLoginProvider,
    AuthService
} from 'angular5-social-login';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';

declare var require: any;
const store = require('store');
declare var $: any;


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    email: string;
    password: string;
    remember = false;
    recapcha_key: string;
    user_type = 'customer';
    routersub: any;
    user: any;
    forgot_email: string;
    show_pass = false;
    return_url: string;


    constructor(
        public cust_service: CustomerService,
        public auth_service: SysAuthService,
        public but_service: ButcherService,
        public spinner_service: SpinnerService,
        private active_router: ActivatedRoute,
        private router: Router,
        public validation: ValidationService,
        public toaster: ToastrService,
        private socialAuthService: AuthService,
        private _location: Location
    ) {
        if (store.get('user')) {
            this._location.back();
        }
    }

    ngOnInit() {
        this.routersub = this.active_router.params.subscribe(params => {
            this.user_type = String(params['type']);
            if (this.user_type === 'butcher') {
                this.return_url = this.active_router.snapshot.queryParams['returnUrl'];
            } else {
                this.return_url = this.active_router.snapshot.queryParams['returnUrl'];
            }
        });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        this.routersub.unsubscribe();
    }

    passInputType() {
        if (this.show_pass) {
            return 'text';
        } else {
            return 'password';
        }
    }

    resolved(response) {
        this.recapcha_key = response;
    }

    signIn() {
        if (this.validation.textValueValidate(this.email) <= 0) {
            this.toaster.error('Invalid email!', 'Error');
            return;
        }
        if (this.validation.textValueValidate(this.password) <= 0) {
            this.toaster.error('Please input password!', 'Error');
            return;
        }
        // if (!this.recapcha_key || this.recapcha_key === '') {
        //     this.toaster.error('Please prove you are not a robot.', 'Error');
        //     return;
        // }
        this.recapcha_key = 'none';
        const param: any = {
            email: this.email,
            password: this.password,
            recaptcha_key: this.recapcha_key,
        };
        if (this.remember) {
            param.remember = this.remember;
        }
        this.user = undefined;
        if (this.user_type === 'customer') {
            this.customerSignIn(param);
        } else if (this.user_type === 'butcher') {
            this.butcherSignIn(param);
        }
    }

    customerSignIn(param) {
        this.spinner_service.show();
        this.auth_service.custSignIn(param).then(data => {
            this.spinner_service.hide();
            // grecaptcha.reset();
            if (data.data && data.token) {
                this.user = data.data;
                store.set('user', this.user);
                store.set('token', data.token);
            }
            this.toaster.success('Sign in successful.', 'Success');
            this.router.navigate([this.return_url || '/user/custaccount']);
        }).catch(error => {
            // grecaptcha.reset();
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    butcherSignIn(param) {
        this.spinner_service.show();
        this.auth_service.butSignIn(param).then(data => {
            this.spinner_service.hide();
            // grecaptcha.reset();
            if (data.data && data.token) {
                this.user = data.data;
                store.set('user', this.user);
                store.set('token', data.token);
            }
            this.toaster.success('Sign in successful.', 'Success');
            this.router.navigate([this.return_url || '/user/buttodayorder']);
        }).catch(error => {
            // grecaptcha.reset();
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    facebookSignIn() {
        const socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        this.socialAuthService.signIn(socialPlatformProvider).then(
            (userData) => {
                console.log(' sign in data : ', userData);
                this.toaster.warning(String(userData), 'Alert');
            }
        );
    }

    forgotPassword() {
        if (!this.forgot_email || this.forgot_email === '') {
            this.toaster.error('Please input email address.', 'Error');
            return;
        }
        const param: any = {
            email: this.forgot_email,
        };
        if (this.user_type === 'customer') {
            this.customerForgotPass(param);
        } else if (this.user_type === 'butcher') {
            this.butcherForgotPass(param);
        }
    }

    customerForgotPass(param) {
        this.spinner_service.show();
        this.cust_service.forgotPassword(param).then(data => {
            this.spinner_service.hide();
            $(document).ready(() => {
                $('#forgotModal').modal('hide');
            });
            this.toaster.success('Please check your email', 'Success');
        }).catch(error => {
            this.spinner_service.hide();
            $(document).ready(() => {
                $('#forgotModal').modal('hide');
            });
            console.log(error);
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    butcherForgotPass(param) {
        this.spinner_service.show();
        this.but_service.forgotPassword(param).then(data => {
            this.spinner_service.hide();
            $(document).ready(() => {
                $('#forgotModal').modal('hide');
            });
            this.toaster.success('Please check your email', 'Success');
        }).catch(error => {
            this.spinner_service.hide();
            $(document).ready(() => {
                $('#forgotModal').modal('hide');
            });
            console.log(error);
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }
}
