import { Component, OnInit } from '@angular/core';
import Constant from '../../../service/constant';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { ValidationService, SpinnerService, CommonService, SiteInfoService, CustomerService, SysAuthService } from '../../../service';
import { ToastrService, Toast } from 'ngx-toastr';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

declare var require: any;
declare var $: any;
const store = require('store');

@Component({
    selector: 'app-delete-account',
    templateUrl: './delete-account.component.html',
    styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

    show_pass = false;
    user: any;
    password: string;

    constructor(
        public auth_service: SysAuthService,
        public validation: ValidationService,
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
        public cust_service: CustomerService,
        public common_service: CommonService,
        public router: Router,
    ) {
        this.user = store.get('user');
    }

    ngOnInit() {
    }

    passInputType() {
        if (this.show_pass) {
            return 'text';
        } else {
            return 'password';
        }
    }

    deleteAccount() {
        if (!this.password || this.password === '') {
            this.toaster.error('Please input password.', 'Error');
            return;
        }
        $(document).ready(() => {
            $('#del_dlg').modal('show');
        });
    }

    deleteAccountProc() {
        this.spinner_service.show();
        this.cust_service.deleteAccount(this.password).then(data => {
            this.spinner_service.hide();
            this.toaster.success('Account removed', 'Success');
            this.auth_service.logout();
        }).catch(error => {
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

}
