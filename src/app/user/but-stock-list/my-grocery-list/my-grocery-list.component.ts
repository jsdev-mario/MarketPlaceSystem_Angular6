import { Component, OnInit } from '@angular/core';
import { SiteInfoService, SpinnerService, CategoryService, StocklistService, SearchService, MenuService } from '../../../service';
import { ToastrService } from 'ngx-toastr';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import swal from 'sweetalert2';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
declare var require: any;
declare var $: any;
const store = require('store');



@Component({
    selector: 'app-my-grocery-list',
    templateUrl: './my-grocery-list.component.html',
    styleUrls: ['./my-grocery-list.component.scss'],
})
export class MyGroceryListComponent implements OnInit {

    user: any;

    number_mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/,
        /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    gram_mask = [/\d/, /\d/, /\d/];

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
        public menu_service: MenuService,
    ) {
        this.user = store.get('user');
        console.log(this.user);
    }

    ngOnInit() {
        this.stlist_service.init();
        if (this.user.shop && this.user.shop.shop_menu) {
            this.spinner_service.show();
            this.menu_service.shopMenu(this.user.shop.shop_menu).then(data => {
                this.spinner_service.hide();
                this.initStockList(data);
            }).catch(error => {
                this.spinner_service.hide();
                if (error.error && error.error.message) {
                    this.toaster.error(error.error.message, 'Error');
                }
            });
        }
    }

    initStockList(data) {
        const categories = data.categories;
        const subcategories: any = {};
        const choices: any = {};
        categories.forEach(category => {
            data.subcategories.forEach(subcategory => {
                if (subcategory.subcategory.category_id === category._id) {
                    subcategories[category._id] = subcategories[category._id] || [];
                    subcategory.name = subcategory.subcategory.name;
                    subcategories[category._id].push(subcategory);
                    data.choices.forEach(choice => {
                        if (choice.choice.subcategory_id === subcategory.subcategory._id) {
                            choices[subcategory.subcategory._id] = choices[subcategory.subcategory._id] || [];
                            choice.name = choice.choice.name;
                            choices[subcategory.subcategory._id].push(choice);
                        }
                    });
                }
            });
        });
        this.stlist_service.categories = categories;
        this.stlist_service.subcategories = subcategories;
        this.stlist_service.choices = choices;
    }

    categorySelected(category) {
        this.stlist_service.selected_subcategories = [];
        this.stlist_service.selected_subcategory = undefined;
        this.stlist_service.selected_choices1 = [];
        this.stlist_service.selected_choices2 = [];
        this.stlist_service.selected_choices3 = [];
        this.stlist_service.selected_choices4 = [];
        this.stlist_service.selected_choice1 = undefined;
        this.stlist_service.selected_choice2 = undefined;
        this.stlist_service.selected_choice3 = undefined;
        this.stlist_service.selected_choice4 = undefined;
        if (this.stlist_service.selected_category === category) {
            this.stlist_service.selected_category = undefined;
            return;
        }
        this.stlist_service.selected_category = category;
        this.getSubcategory();
    }

    getSubcategory() {
        this.stlist_service.getSubCategories();
    }

    subcategorySelected(subcategory) {
        this.stlist_service.selected_choices1 = [];
        this.stlist_service.selected_choices2 = [];
        this.stlist_service.selected_choices3 = [];
        this.stlist_service.selected_choices4 = [];
        this.stlist_service.selected_choice1 = undefined;
        this.stlist_service.selected_choice2 = undefined;
        this.stlist_service.selected_choice3 = undefined;
        this.stlist_service.selected_choice4 = undefined;
        if (this.stlist_service.selected_subcategory === subcategory) {
            this.stlist_service.selected_subcategory = undefined;
            return;
        }
        this.stlist_service.selected_subcategory = subcategory;
        this.getChoices();
    }

    getChoices() {
        if (this.stlist_service.selected_subcategory) {
            this.stlist_service.selected_choices1 = [];
            this.stlist_service.selected_choices2 = [];
            this.stlist_service.selected_choices3 = [];
            this.stlist_service.selected_choices4 = [];
            this.stlist_service.selected_choice1 = undefined;
            this.stlist_service.selected_choice2 = undefined;
            this.stlist_service.selected_choice3 = undefined;
            this.stlist_service.selected_choice4 = undefined;
            if (this.stlist_service.choices[this.stlist_service.selected_subcategory.subcategory._id] === undefined) {
                this.cat_service.getChoice(this.stlist_service.selected_subcategory.subcategory._id)
                    .then(choices => {
                        const temp_choices: any[] = [];
                        choices.forEach(element => {
                            temp_choices.push({
                                choice: element,
                                name: element.name,
                                price: 0.0,
                            });
                        });
                        this.stlist_service.choices[this.stlist_service.selected_subcategory.subcategory._id] = temp_choices;
                        if (temp_choices.length > 0) {
                            temp_choices.forEach(choice => {
                                if (choice.choice.choice_num === 1) {
                                    this.stlist_service.selected_choices1.push(choice);
                                } else if (choice.choice.choice_num === 2) {
                                    this.stlist_service.selected_choices2.push(choice);
                                } else if (choice.choice.choice_num === 3) {
                                    this.stlist_service.selected_choices3.push(choice);
                                } else if (choice.choice.choice_num === 4) {
                                    this.stlist_service.selected_choices4.push(choice);
                                }
                            });
                        }
                        this.stlist_service.sort();
                    }).catch(e => {
                        console.log(e);
                    });
            } else {
                const selected_choices = this.stlist_service.choices[this.stlist_service.selected_subcategory.subcategory._id];
                if (selected_choices.length > 0) {
                    selected_choices.forEach(choice => {
                        if (choice.choice.choice_num === 1) {
                            this.stlist_service.selected_choices1.push(choice);
                        } else if (choice.choice.choice_num === 2) {
                            this.stlist_service.selected_choices2.push(choice);
                        } else if (choice.choice.choice_num === 3) {
                            this.stlist_service.selected_choices3.push(choice);
                        } else if (choice.choice.choice_num === 4) {
                            this.stlist_service.selected_choices4.push(choice);
                        }
                    });
                }
                this.stlist_service.sort();
            }
        }
    }

    choiceSelected(choice) {
        if (choice.choice.choice_num === 1) {
            if (this.stlist_service.selected_choice1 === choice) {
                this.stlist_service.selected_choice1 = {};
                return;
            }
            this.stlist_service.selected_choice1 = choice;
        } else if (choice.choice.choice_num === 2) {
            if (this.stlist_service.selected_choice2 === choice) {
                this.stlist_service.selected_choice2 = {};
                return;
            }
            this.stlist_service.selected_choice2 = choice;
        } else if (choice.choice.choice_num === 3) {
            if (this.stlist_service.selected_choice3 === choice) {
                this.stlist_service.selected_choice3 = {};
                return;
            }
            this.stlist_service.selected_choice3 = choice;
        } else if (choice.choice.choice_num === 4) {
            if (this.stlist_service.selected_choice4 === choice) {
                this.stlist_service.selected_choice4 = {};
                return;
            }
            this.stlist_service.selected_choice4 = choice;
        }
    }

    deleteCategory(index, event) {
        event.stopPropagation();
        swal({
            title: 'Confirm',
            text: 'Are you sure you want to delete the selected item?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F6931D',
            cancelButtonColor: 'grey',
            confirmButtonText: 'Ok',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                const subcategories = this.stlist_service.subcategories[this.stlist_service.categories[index]._id];
                if (subcategories) {
                    subcategories.forEach(subcategory => {
                        if (this.stlist_service.choices[subcategory.subcategory._id]) {
                            delete this.stlist_service.choices[subcategory.subcategory._id];
                            this.stlist_service.selected_offer_subcategories = [];
                        }
                    });
                    delete this.stlist_service.subcategories[this.stlist_service.categories[index]._id];
                }
                if (this.stlist_service.selected_category &&
                    this.stlist_service.selected_category._id === this.stlist_service.categories[index]._id) {
                    this.stlist_service.selected_subcategories = [];
                    this.stlist_service.selected_subcategory = undefined;
                }
                const cat_name = this.stlist_service.categories[index].name;
                this.stlist_service.categories.splice(index, 1);
                swal({
                    title: 'Deleted!',
                    text: `${cat_name} has been deleted.`,
                    type: 'success',
                    confirmButtonColor: '#F6931D',
                });
            }
        });
    }

    deleteSubCat(index, event) {
        event.stopPropagation();
        swal({
            title: 'Confirm',
            text: 'Are you sure you want to delete the selected item?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F6931D',
            cancelButtonColor: 'grey',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                if (this.stlist_service.choices[this.stlist_service.selected_subcategories[index].subcategory._id]) {
                    delete this.stlist_service.choices[this.stlist_service.selected_subcategories[index].subcategory._id];
                    if (this.stlist_service.selected_subcategory && this.stlist_service.selected_subcategory.subcategory._id ===
                        this.stlist_service.selected_subcategories[index].subcategory._id) {
                        this.stlist_service.selected_choices1 = undefined;
                        this.stlist_service.selected_choices2 = undefined;
                        this.stlist_service.selected_choices3 = undefined;
                        this.stlist_service.selected_choices4 = undefined;
                        this.stlist_service.selected_choice1 = undefined;
                        this.stlist_service.selected_choice2 = undefined;
                        this.stlist_service.selected_choice3 = undefined;
                        this.stlist_service.selected_choice4 = undefined;
                    }
                }
                const cat_name = this.stlist_service.selected_subcategories[index].name;
                this.stlist_service.selected_subcategories.splice(index, 1);
                if (this.stlist_service.selected_offer_category === this.stlist_service.selected_category) {
                    this.stlist_service.selected_offer_subcategories = [];
                    this.stlist_service.subcategories[this.stlist_service.selected_offer_category._id].forEach(element => {
                        if (element.offer) {
                            this.stlist_service.selected_offer_subcategories.push(element);
                        }
                    });
                }
                swal({
                    title: 'Deleted!',
                    text: `${cat_name} has been deleted.`,
                    type: 'success',
                    confirmButtonColor: '#F6931D',
                });
            }
        });
    }

    deleteChoice(choice, index) {
        const temp_choices = this.stlist_service.choices[this.stlist_service.selected_subcategory.subcategory._id];
        for (let i = 0; i < temp_choices.length; i++) {
            if (temp_choices[i].choice._id === choice.choice._id) {
                temp_choices.splice(i, 1);
            }
        }
        if (choice.choice.choice_num === 1) {
            this.stlist_service.selected_choices1.splice(index, 1);
        } else if (choice.choice.choice_num === 2) {
            this.stlist_service.selected_choices2.splice(index, 1);
        } else if (choice.choice.choice_num === 3) {
            this.stlist_service.selected_choices3.splice(index, 1);
        } else if (choice.choice.choice_num === 4) {
            this.stlist_service.selected_choices4.splice(index, 1);
        }
    }

    addOfferSubCat(index, event) {
        event.stopPropagation();
        this.stlist_service.selected_subcategories[index].offer = {
            qty: 3,
            price: this.stlist_service.selected_subcategories[index].price * 3 - 0.1,
        };
        this.stlist_service.selected_offer_category = this.stlist_service.selected_category;
        this.stlist_service.selected_offer_subcategory = this.stlist_service.selected_subcategories[index];
        this.stlist_service.selected_offer_subcategories = [];
        const temp_subcategories: any[] = [];
        this.stlist_service.subcategories[this.stlist_service.selected_offer_category._id].forEach(element => {
            if (element.offer) {
                this.stlist_service.selected_offer_subcategories.push(element);
            }
        });
    }

    qtyChange(event) {
        if (event.target.value === '') {
            return 1;
        }
        return event.target.value;
    }

    numberFormat(event) {
        if (event.target.value === '') {
            return '0.00';
        }
        return Number(event.target.value).toFixed(2);
    }

    subCatPriceFocus(event) {
        if (this.stlist_service.selected_subcategory.offer) {
            this.toaster.error(`Delete '${this.stlist_service.selected_subcategory.name}' from offers to edit its values`, 'Error');
            return;
        }
    }

    subCatQtyFocus(event) {
        if (this.stlist_service.selected_subcategory.offer) {
            this.toaster.error(`Delete '${this.stlist_service.selected_subcategory.name}' from offers to edit its values`, 'Error');
            return;
        }
    }

    unitChange(event) {
        if (this.stlist_service.selected_subcategory.unit === 0) {
            this.stlist_service.selected_subcategory.qty = 1;
        }
    }
}
