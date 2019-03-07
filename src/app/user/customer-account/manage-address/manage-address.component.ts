import { Component, OnInit } from '@angular/core';
import Constant from '../../../service/constant';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { ValidationService, SpinnerService, CommonService, SiteInfoService, CustomerService } from '../../../service';
import { ToastrService, Toast } from 'ngx-toastr';

declare var require: any;
const store = require('store');

@Component({
    selector: 'app-manage-address',
    templateUrl: './manage-address.component.html',
    styleUrls: ['./manage-address.component.css']
})
export class ManageAddressComponent implements OnInit {

    user: any;
    address_line1: string;
    address_line2: string;
    city: string;
    post_code: string;
    address_name: string;

    editable: any[] = [];

    constructor(
        public validation: ValidationService,
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
        public cust_service: CustomerService,
        public common_service: CommonService,
    ) {
        this.user = store.get('user');
        this.user.delivery_addresses.forEach(element => {
            this.editable.push(false);
        });
    }

    ngOnInit() {

    }

    addNewAddress() {
        if (!this.address_line1 || this.address_line1 === '') {
            this.toaster.error('Please input address line1', 'Error');
            return;
        }
        if (!this.post_code || this.post_code === '') {
            this.toaster.error('Please input postcode', 'Error');
            return;
        }
        if (!this.validation.postCodeValidate(this.post_code)) {
            this.toaster.error('Invalid postcode', 'Error');
            return;
        }
        if (!this.address_name || this.address_name === '') {
            this.toaster.error('Please input address name', 'Error');
            return;
        }
        const address: any = {
            address_line1: this.address_line1,
            post_code: this.post_code,
        };
        if (this.city && this.city !== '') {
            address.city = this.city;
        }
        if (this.address_line2 && this.address_line2 !== '') {
            address.address_line2 = this.address_line2;
        }
        this.spinner_service.show();
        this.common_service.getAddressToLocation(address).then(location_data => {
            address.location = location_data;
            address.address_name = this.address_name;
            this.cust_service.addDeliveryAddress(address).then(data => {
                this.spinner_service.hide();
                this.user = data;
                store.set('user', data);
                this.reset();
                this.toaster.success('Address saved', 'Error');
            }).catch(error => {
                this.spinner_service.hide();
                if (error.error && error.error.message) {
                    this.toaster.error(error.error.message, 'Error');
                }
            });
        }).catch(error => {
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    addressSave(index) {
        const address = this.user.delivery_addresses[index];
        if (!address.address_name || address.address_name === '') {
            this.toaster.error('Please input address name', 'Error');
            return;
        }
        if (!address.address_line1 || address.address_line1 === '') {
            this.toaster.error('Please input address line1', 'Error');
            return;
        }
        if (!address.post_code || address.post_code === '') {
            this.toaster.error('Please input postcode', 'Error');
            return;
        }
        if (!this.validation.postCodeValidate(address.post_code)) {
            this.toaster.error('Invalid postcode', 'Error');
            return;
        }
        const param: any = {
            address_line1: address.address_line1,
            post_code: address.post_code,
        };
        if (address.address_line2 && address.address_line2 !== '') {
            param.address_line2 = address.address_line2;
        }
        if (address.city && address.city !== '') {
            param.city = address.city;
        }
        this.spinner_service.show();
        this.common_service.getAddressToLocation(param).then(location_data => {
            param.location = location_data;
            param.address_name = address.address_name;
            param._id = address._id;
            this.cust_service.updateDeliveryAddress(param).then(data => {
                this.spinner_service.hide();
                address.address_name = data.address_name;
                address.address_line1 = data.address_line1;
                address.address_line2 = data.address_line2;
                address.post_code = data.post_code;
                address.city = data.city;
                store.set('user', this.user);
                this.toaster.success('Address saved.', 'Success');
                this.editable[index] = false;
            }).catch(error => {
                this.spinner_service.hide();
                if (error.error && error.error.message) {
                    this.toaster.error(error.error.message, 'Error');
                }
            });
        }).catch(error => {
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    addressRemove(index) {
        if (this.user.delivery_addresses[index]._id) {
            const param: any = {
                address_id: this.user.delivery_addresses[index]._id
            };
            this.spinner_service.show();
            this.cust_service.removeDeliveryAddress(param).then(data => {
                this.spinner_service.hide();
                this.user = data;
                store.set('user', this.user);
                this.toaster.success('Address removed', 'Success');
            }).catch(error => {
                this.spinner_service.hide();
                if (error.error && error.error.message) {
                    this.toaster.error(error.error.message, 'Error');
                }
            });
        }
    }

    reset() {
        this.address_line1 = undefined;
        this.address_line2 = undefined;
        this.address_name = undefined;
        this.post_code = undefined;
        this.city = undefined;
    }
}
