import { Component, OnInit } from '@angular/core';
import {
    SiteInfoService, SpinnerService, CategoryService, StocklistService, ButcherService,
    SearchService, SysAuthService, StatusService
} from '../../service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import Constants from '../../service/constant';

declare var require: any;
const store = require('store');
declare var $: any;

@Component({
    selector: 'app-but-stock-list',
    templateUrl: './but-stock-list.component.html',
    styleUrls: ['./but-stock-list.component.css'],
})
export class ButStockListComponent implements OnInit {

    user: any;
    constructor(
        public toaster: ToastrService,
        public cat_service: CategoryService,
        public stlist_service: StocklistService,
        public spinner_service: SpinnerService,
        public but_service: ButcherService,
        private router: Router,
        public auth_service: SysAuthService,
        public status_service: StatusService,
    ) {
        this.user = store.get('user');
        this.status_service.events.emit({
            message: Constants.eventNames.HEADER_STYLE,
            header_style: 1
        });
    }

    ngOnInit() {

    }

    save() {
        const categories: string[] = [];
        const subcategories: any[] = [];
        const choices: any[] = [];
        let flag = false;
        this.stlist_service.categories.forEach(category => {
            categories.push(category._id);
            if (this.stlist_service.subcategories[category._id]) {
                this.stlist_service.subcategories[category._id].forEach(subcategory => {
                    const new_subcat: any = {
                        subcategory: subcategory.subcategory._id,
                        description: subcategory.description,
                        qty: subcategory.qty,
                        price: subcategory.price,
                        is_available: subcategory.is_available,
                        unit: subcategory.unit,
                    };
                    if (subcategory.offer !== undefined) {
                        if ((subcategory.price * subcategory.offer.qty - subcategory.offer.price) <= 0) {
                            // tslint:disable-next-line:max-line-length
                            this.toaster.error(`Offer price should be less than original price! Please check ${category.name}/${subcategory.name}`, 'Error');
                            flag = true;
                        }
                        new_subcat.offer = subcategory.offer;
                    }
                    subcategories.push(new_subcat);
                    if (this.stlist_service.choices[subcategory.subcategory._id]) {
                        this.stlist_service.choices[subcategory.subcategory._id].forEach(choice => {
                            choices.push({
                                choice: choice.choice._id,
                                price: choice.price,
                            });
                        });
                    }
                });
            }
        });
        if (flag) {
            return;
        }
        const param: any = {
            shop_menu: {
                categories: categories,
                subcategories: subcategories,
                choices: choices,
            }
        };
        if (this.user.shop.shop_menu) {
            param.shop_menu._id = this.user.shop.shop_menu;
        }
        console.log(param);
        this.spinner_service.show();
        this.stlist_service.saveMenu(param).then(data => {
            const new_param: any = {
                shop_menu: data,
                shop_id: this.user.shop._id,
            };
            this.but_service.updateShopMenu(new_param).then(shop => {
                this.spinner_service.hide();
                this.user.shop = shop;
                store.set('user', this.user);
                this.toaster.success('Stocklist saved', 'Success');
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

    canDeactivate() {
        const confirm_dlg =
            window.confirm('Are you sure you want to leave this page?\r\n Any changes will be lost if you navigate away from this page.');
        if (confirm_dlg) {
            if (this.status_service.logout_delay) {
                this.auth_service.logout();
            }
            return true;
        } else {
            this.status_service.logout_delay = false;
            return false;
        }
    }
}

