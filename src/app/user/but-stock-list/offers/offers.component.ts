import { Component, OnInit, Output } from '@angular/core';
import { SiteInfoService, SpinnerService, CategoryService, StocklistService } from '../../../service';
import { ToastrService } from 'ngx-toastr';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

    number_mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/,
        /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

    price_mask = createNumberMask({
        prefix: '',
        allowDecimal: true,
        includeThousandsSeparator: false,
    });

    constructor(
        public toaster: ToastrService,
        public cat_service: CategoryService,
        public stlist_service: StocklistService,
        public spinner_service: SpinnerService,
    ) { }

    ngOnInit() {

    }

    categorySelected(category) {
        this.stlist_service.selected_offer_subcategories = [];
        this.stlist_service.selected_subcategory = undefined;
        if (this.stlist_service.selected_offer_category === category) {
            this.stlist_service.selected_offer_category = undefined;
            return;
        }
        this.stlist_service.selected_offer_category = category;
        this.stlist_service.selected_offer_subcategories =
            this.filterSubcat(this.stlist_service.subcategories[this.stlist_service.selected_offer_category._id]);
    }

    subcategorySelected(subcategory) {
        if (this.stlist_service.selected_offer_subcategory === subcategory) {
            this.stlist_service.selected_offer_subcategory = undefined;
            return;
        }
        this.stlist_service.selected_offer_subcategory = subcategory;
    }

    displayUnit(subcategory) {
        if (subcategory.unit === 0) {
            return '1 Each';
        } else if (subcategory.unit === 1) {
            return subcategory.qty + ' Kg';
        } else {
            return subcategory.qty + ' g';
        }
    }

    displayUnit1(subcategory) {
        if (subcategory.unit === 0) {
            return '';
        } else if (subcategory.unit === 1) {
            return subcategory.qty + ' Kg';
        } else {
            const t_qty = subcategory.offer.qty * subcategory.qty;
            if (t_qty >= 1000) {
                return `${subcategory.qty} g (${(t_qty / 1000).toFixed(2)} Kg)`;
            }
            return subcategory.qty + ' g';
        }
    }

    deleteOffer(index) {
        const subcategory = this.stlist_service.selected_offer_subcategories[index];
        this.stlist_service.selected_offer_subcategories.splice(index, 1);
        subcategory.offer = undefined;
    }

    addOffer(index) {
        const subcategory = this.stlist_service.selected_offer_subcategories[index];
        if (subcategory.offer === undefined) {
            subcategory.offer = {
                qty: 3,
                price: 0.0,
            };
        }
    }

    numberFormat(event) {
        console.log(event.target.value);
        return Number(event.target.value).toFixed(2);
    }

    filterCat(categories) {
        const temp_category: any[] = [];
        categories.forEach(element => {
            if (this.isExistSubCatInOffer(element)) {
                temp_category.push(element);
            }
        });
        return temp_category;
    }

    isExistSubCatInOffer(category) {
        const subcategories = this.stlist_service.subcategories[category._id];
        if (subcategories) {
            for (let i = 0; i < subcategories.length; i++) {
                if (subcategories[i].offer) {
                    return true;
                }
            }
        }
        return false;
    }

    filterSubcat(subcategories) {
        const temp_subcategories: any[] = [];
        subcategories.forEach(element => {
            if (element.offer) {
                temp_subcategories.push(element);
            }
        });
        return temp_subcategories;
    }

    discount(subcategory) {
        const dis_price = subcategory.price * subcategory.offer.qty - subcategory.offer.price;
        return dis_price;
    }
}
