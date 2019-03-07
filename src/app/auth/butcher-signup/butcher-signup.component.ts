import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { ButcherService, ValidationService, SpinnerService, CommonService, SiteInfoService, SysAuthService } from '../../service';
import { Router } from '@angular/router';
import Constant from '../../service/constant';
import { ToastrService } from 'ngx-toastr';
const store = require('store');

@Component({
    selector: 'app-butcher-signup',
    templateUrl: './butcher-signup.component.html',
    styleUrls: ['./butcher-signup.component.css']
})
export class ButcherSignupComponent implements OnInit {

    phone_mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/,
        /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

    titles = [
        { id: 0, name: Constant.titles_label[0] },
        { id: 1, name: Constant.titles_label[1] },
        { id: 2, name: Constant.titles_label[2] },
        { id: 3, name: Constant.titles_label[3] },
        { id: 4, name: Constant.titles_label[4] },
    ];

    title = 0;
    first_name: string;
    last_name: string;
    email: string;
    mobile_phone: string;
    address_line1: string;
    address_line2: string;
    town_city: string;
    post_code: string;
    shop_name: string;
    other_info: string;
    password: string;
    show_pass = false;
    is_upload_proof: number;
    is_upload_proofowner: number;
    selected_proofid_type: number;
    selected_ownership_type: number;

    proof_id_files: any[] = [];
    proof_id_filenames: any[] = [];
    proof_ownership_files: any[] = [];
    proof_ownership_filenames: any[] = [];

    driving_licence_filename: string;
    passport_filename: string;
    utility_filename: string;
    aggrement_filename: string;
    ownership_filename: string;


    user: any = {};
    site_info: any;

    proofidtype_items: any[] = [];

    proofownershiptype_items: any[] = [];

    constructor(
        public butcher_service: ButcherService,
        public auth_service: SysAuthService,
        public siteinfo_service: SiteInfoService,
        private router: Router,
        public validation: ValidationService,
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
        public common_service: CommonService,
    ) {
        this.site_info = store.get('site_info');
        if (this.site_info) {
            this.initData();
        } else {
            this.siteinfo_service.getSiteInfo().then(data => {
                store.set('site_info', data);
                this.site_info = data;
                this.initData();
            }).catch(error => {
                console.log(error);
            });
        }
    }

    ngOnInit() {

    }

    initData() {
        this.site_info.proof_id_types.forEach((element, index) => {
            this.proofidtype_items.push({
                id: index,
                name: element
            });
        });
        this.site_info.proof_ownership_types.forEach((element, index) => {
            this.proofownershiptype_items.push({
                id: index,
                name: element
            });
        });
    }

    proofFileUpload(event) {
        if (this.selected_proofid_type === undefined) {
            this.toaster.error('Please choose proof of ID type', 'Error');
            return;
        }
        const file_browser = event.target;
        if (file_browser.files && file_browser.files[0]) {
            const form_data = new FormData();
            form_data.append('image', file_browser.files[0]);
            this.is_upload_proof = 0;
            this.spinner_service.show();
            this.butcher_service.uploadFile(form_data)
                .then(data => {
                    this.spinner_service.hide();
                    this.toaster.success('Upload done!', 'Success');
                    this.is_upload_proof = 1;
                    this.addProofIdFile(data);
                    this.addProofIdFileNames(file_browser.files[0].name);
                }).catch(e => {
                    this.spinner_service.hide();
                    this.toaster.error('Upload fail!', 'Error');
                    this.is_upload_proof = 2;
                });
        }
    }

    addProofIdFileNames(file_name) {
        for (let i = 0; i < this.proof_id_filenames.length; i++) {
            if (this.proof_id_filenames[i].type === this.proofidtype_items[this.selected_proofid_type].name) {
                this.proof_id_filenames[i].file_name = file_name;
                console.log(this.proof_id_filenames);
                return;
            }
        }
        this.proof_id_filenames.push({
            type: this.proofidtype_items[this.selected_proofid_type].name,
            file_name: file_name,
        });
    }

    addProofIdFile(file) {
        for (let i = 0; i < this.proof_id_files.length; i++) {
            if (this.proof_id_files[i].type === this.proofidtype_items[this.selected_proofid_type].name) {
                this.proof_id_files[i].file = file;
                return;
            }
        }
        this.proof_id_files.push({
            type: this.proofidtype_items[this.selected_proofid_type].name,
            file: file,
        });
    }

    proofOwnerFileUpload(event) {
        if (this.selected_ownership_type === undefined) {
            this.toaster.error('Please choose proof file type of ownership', 'Error');
            return;
        }
        const file_browser = event.target;
        if (file_browser.files && file_browser.files[0]) {
            const form_data = new FormData();
            form_data.append('image', file_browser.files[0]);
            this.is_upload_proofowner = 0;
            this.spinner_service.show();
            this.butcher_service.uploadFile(form_data)
                .then(data => {
                    this.spinner_service.hide();
                    this.toaster.success('Upload done!', 'Success');
                    this.is_upload_proofowner = 1;
                    this.addProofOwnerShipFile(data);
                    this.addProofOwnerShipFileName(file_browser.files[0].name);
                }).catch(e => {
                    this.spinner_service.hide();
                    this.toaster.error('Upload fail!', 'Error');
                    this.is_upload_proofowner = 2;
                });
        }
    }

    addProofOwnerShipFileName(file_name) {
        for (let i = 0; i < this.proof_ownership_filenames.length; i++) {
            if (this.proof_ownership_filenames[i].type === this.proofownershiptype_items[this.selected_ownership_type].name) {
                this.proof_ownership_filenames[i].file_name = file_name;
                return;
            }
        }
        this.proof_ownership_filenames.push({
            type: this.proofownershiptype_items[this.selected_ownership_type].name,
            file_name: file_name,
        });
    }

    addProofOwnerShipFile(file) {
        for (let i = 0; i < this.proof_ownership_files.length; i++) {
            if (this.proof_ownership_files[i].type === this.proofownershiptype_items[this.selected_ownership_type].name) {
                this.proof_ownership_files[i].file = file;
                return;
            }
        }
        this.proof_ownership_files.push({
            type: this.proofownershiptype_items[this.selected_ownership_type].name,
            file: file,
        });
    }

    passInputType() {
        if (this.show_pass) {
            return 'text';
        } else {
            return 'password';
        }
    }

    uploadBtnValidate(value) {
        if (value === undefined) {
            return 'mt-disable-btn';
        } else if (value === 0) {
            return 'mt-disable-btn';
        } else if (value === 1) {
            return 'mt-uploaded-btn';
        } else if (value === 2) {
            return 'mt-btn';
        }
    }

    submitValidate() {
        if (
            this.validation.textValueValidate(this.first_name) > 0 &&
            this.validation.textValueValidate(this.last_name) > 0 &&
            this.validation.textValueValidate(this.email) > 0 &&
            this.validation.textValueValidate(this.mobile_phone) > 0 &&
            this.validation.textValueValidate(this.address_line1) > 0 &&
            this.validation.textValueValidate(this.town_city) > 0 &&
            this.validation.textValueValidate(this.shop_name) > 0 &&
            this.validation.textValueValidate(this.post_code) > 0 &&
            this.validation.textValueValidate(this.password) > 0
        ) {
            return true;
        } else {
            return false;
        }
    }

    poscodeFocuse() {
        if (this.post_code && this.post_code !== '') {
            $(document).ready(() => {
                $('#post_code').addClass('mt-success-input');
            });
        }
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



    submit() {
        if (this.submitValidate()) {
            if (this.password.length < 8 || !this.validationPassword()) {
                this.toaster.error('Password must be at least 8 characters long.\r\n(Please include letters and numbers)', 'Error');
                return;
            }
            if (!this.validation.emailValidate(this.email)) {
                this.toaster.error('Invalid email', 'Error');
                return;
            }
            if (!this.validation.emailValidate(this.email)) {
                this.toaster.error('Invalid email', 'Error');
                return;
            }
            if (!this.validation.postCodeValidate(this.post_code)) {
                $(document).ready(() => {
                    console.log(0);
                    $('#post_code').removeClass('mt-success-input');
                    $('#post_code').addClass('mt-danger-input');
                });
                this.toaster.error('Invalid post code', 'Error');
                return;
            }
            const param: any = {
                title: this.title,
                first_name: this.first_name,
                last_name: this.last_name,
                email: this.email,
                mobile_phone: this.mobile_phone,
                password: this.password,
                user_type: Constant.userType.BUTCHER,
                user_role: Constant.userRole.butchers.MANAGER,
                shop: {
                    shop_name: this.shop_name,
                    other_info: this.other_info,
                    address_line1: this.address_line1,
                    town_city: this.town_city,
                    post_code: this.post_code,
                    proof_id_files: this.proof_id_files,
                    proof_ownership_files: this.proof_ownership_files,
                }
            };
            if (this.address_line2 !== undefined && this.address_line2 !== '') {
                param.shop.address_line2 = this.address_line2;
            }
            console.log(param);
            this.spinner_service.show();
            this.common_service.getDataByPostCode(this.post_code).then((data) => {
                if (data.status === 200 && data.result) {
                    param.shop.location = {
                        latitude: data.result.latitude,
                        longitude: data.result.longitude
                    };
                    this.auth_service.butSignUp(param).then(user => {
                        this.spinner_service.hide();
                        this.toaster.success('Signup Success.', 'Success');
                        this.router.navigate(['/auth/login', 'butcher']);
                    }).catch(e => {
                        this.spinner_service.hide();
                        if (e.error && e.error.message) {
                            this.toaster.error(e.error.message, 'Error');
                        }
                    });
                }
            }).catch(error => {
                this.spinner_service.hide();
                $(document).ready(() => {
                    console.log(0);
                    $('#post_code').removeClass('mt-success-input');
                    $('#post_code').addClass('mt-danger-input');
                });
                this.toaster.error('Invalid post code', 'Error');
            });
        } else {
            this.toaster.error('Please fill required fields.', 'Error');
        }
    }


}

declare var $: any;
