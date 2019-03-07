import { Component, OnInit } from '@angular/core';
import { SiteInfoService, SpinnerService, CategoryService, StocklistService, WindowRef } from '../../../service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-grocery-list',
    templateUrl: './grocery-list.component.html',
    styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent implements OnInit {

    nativeWindow: any;

    constructor(
        public toaster: ToastrService,
        public cat_service: CategoryService,
        public stlist_service: StocklistService,
        public spinner_service: SpinnerService,
        public win_ref: WindowRef,
    ) {
        this.nativeWindow = this.win_ref.getNativeWindow();
    }

    ngOnInit() {
        this.cat_service.init();
        this.spinner_service.show();
        this.cat_service.getCategory().then(data => {
            this.cat_service.categories = data;
            this.cat_service.sort();
            this.spinner_service.hide();
        }).catch(e => {
            console.log(e);
            this.toaster.error('Category get fail', 'Error');
            this.spinner_service.hide();
        });
    }

    categorySelected(category) {
        this.cat_service.selected_subcategories = [];
        this.cat_service.selected_subcategory = {};
        this.cat_service.selected_choices1 = [];
        this.cat_service.selected_choices2 = [];
        this.cat_service.selected_choices3 = [];
        this.cat_service.selected_choices4 = [];
        this.cat_service.selected_choice1 = undefined;
        this.cat_service.selected_choice2 = undefined;
        this.cat_service.selected_choice3 = undefined;
        this.cat_service.selected_choice4 = undefined;
        if (this.cat_service.selected_category === category) {
            this.cat_service.selected_category = undefined;
            return;
        }
        this.cat_service.selected_category = category;
        this.getSubcategory();
    }

    getSubcategory() {
        if (this.cat_service.selected_category) {
            this.cat_service.getSubcategory(this.cat_service.selected_category._id)
                .then(data => {
                    this.cat_service.selected_subcategories = data;
                    this.cat_service.sort();
                }).catch(e => {
                    console.log(e);
                });
        }
    }

    subcategorySelected(e, subcategory) {
        this.cat_service.selected_choices1 = [];
        this.cat_service.selected_choices2 = [];
        this.cat_service.selected_choices3 = [];
        this.cat_service.selected_choices4 = [];
        this.cat_service.selected_choice1 = undefined;
        this.cat_service.selected_choice2 = undefined;
        this.cat_service.selected_choice3 = undefined;
        this.cat_service.selected_choice4 = undefined;
        if (this.cat_service.selected_subcategory === subcategory) {
            this.cat_service.selected_subcategory = undefined;
            return;
        }
        this.cat_service.selected_subcategory = subcategory;
        this.getChoices();
    }

    getChoices() {
        if (this.cat_service.selected_subcategory) {
            this.cat_service.getChoice(this.cat_service.selected_subcategory._id)
                .then(choices => {
                    if (choices.length > 0) {
                        choices.forEach(choice => {
                            if (choice.choice_num === 1) {
                                this.cat_service.selected_choices1.push(choice);
                            } else if (choice.choice_num === 2) {
                                this.cat_service.selected_choices2.push(choice);
                            } else if (choice.choice_num === 3) {
                                this.cat_service.selected_choices3.push(choice);
                            } else if (choice.choice_num === 4) {
                                this.cat_service.selected_choices4.push(choice);
                            }
                        });
                    }
                    this.cat_service.sort();
                }).catch(e => {
                    console.log(e);
                });
        }
    }

    choiceSelected(e, choice) {
        if (choice.choice_num === 1) {
            if (this.cat_service.selected_choice1 === choice) {
                this.cat_service.selected_choice1 = {};
                return;
            }
            this.cat_service.selected_choice1 = choice;
        } else if (choice.choice_num === 2) {
            if (this.cat_service.selected_choice2 === choice) {
                this.cat_service.selected_choice2 = {};
                return;
            }
            this.cat_service.selected_choice2 = choice;
        } else if (choice.choice_num === 3) {
            if (this.cat_service.selected_choice3 === choice) {
                this.cat_service.selected_choice3 = {};
                return;
            }
            this.cat_service.selected_choice3 = choice;
        } else if (choice.choice_num === 4) {
            if (this.cat_service.selected_choice4 === choice) {
                this.cat_service.selected_choice4 = {};
                return;
            }
            this.cat_service.selected_choice4 = choice;
        }
    }

    extractCategory(index, event) {
        const selected_category = this.cat_service.categories[index];
        if (this.cat_service.selected_category && this.cat_service.selected_category._id === selected_category._id) {
            event.stopPropagation();
        }
        this.stlist_service.categories.push(selected_category);
        this.stlist_service.selected_category = selected_category;
        this.stlist_service.selected_subcategories = [];
        this.stlist_service.sort();
    }

    isExtractCat(category) {
        for (let i = 0; i < this.stlist_service.categories.length; i++) {
            if (this.stlist_service.categories[i]._id === category._id) {
                return true;
            }
        }
        return false;
    }

    extractSubCat(index, event) {
        const selected_subcategory = this.cat_service.selected_subcategories[index];
        if (this.cat_service.selected_subcategory._id === selected_subcategory._id) {
            event.stopPropagation();
        }
        if (this.stlist_service.subcategories[this.cat_service.selected_category._id] === undefined) {
            this.stlist_service.subcategories[this.cat_service.selected_category._id] = [];
        }
        const new_subcategory = {
            subcategory: selected_subcategory,
            name: selected_subcategory.name,
            description: selected_subcategory.description,
            qty: 1,
            price: 0.0,
            unit: 0,
            is_available: true,
        };
        this.stlist_service.subcategories[this.cat_service.selected_category._id].push(new_subcategory);
        this.stlist_service.selected_category = this.cat_service.selected_category;
        this.stlist_service.sort();
        this.cat_service.getChoice(selected_subcategory._id).then(choices => {
            const temp_choices: any[] = [];
            choices.forEach(element => {
                temp_choices.push({
                    choice: element,
                    name: element.name,
                    price: 0.0,
                });
            });
            this.stlist_service.selected_subcategories = this.stlist_service.subcategories[this.cat_service.selected_category._id];
            this.stlist_service.selected_subcategory = new_subcategory;
            this.stlist_service.choices[selected_subcategory._id] = temp_choices;
            this.stlist_service.sort();
            if (this.stlist_service.selected_subcategory) {
                this.stlist_service.selected_choices1 = [];
                this.stlist_service.selected_choices2 = [];
                this.stlist_service.selected_choices3 = [];
                this.stlist_service.selected_choices4 = [];
                this.stlist_service.selected_choice1 = undefined;
                this.stlist_service.selected_choice2 = undefined;
                this.stlist_service.selected_choice3 = undefined;
                this.stlist_service.selected_choice4 = undefined;
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
            }
        });
    }

    isExtractSubCat(index) {
        if (!this.isExtractCat(this.cat_service.selected_category)) {
            return true;
        }
        const subcategories = this.stlist_service.subcategories[this.cat_service.selected_category._id];
        if (subcategories !== undefined) {
            for (let i = 0; i < subcategories.length; i++) {
                if (subcategories[i].subcategory._id === this.cat_service.selected_subcategories[index]._id) {
                    return true;
                }
            }
        } else {
            return false;
        }
        return false;
    }

    extractChoice(choice, event) {
        event.stopPropagation();
        let choices = this.stlist_service.choices[this.cat_service.selected_subcategory._id];
        if (choices === undefined) {
            choices = [];
        }
        const new_choice = {
            choice: choice,
            name: choice.name,
            price: 0.0,
        };
        choices.push(new_choice);
        if (this.cat_service.selected_subcategory._id === this.stlist_service.selected_subcategory.subcategory._id) {
            if (choice.choice_num === 1) {
                this.stlist_service.selected_choices1.push(new_choice);
            } else if (choice.choice_num === 2) {
                this.stlist_service.selected_choices2.push(new_choice);
            } else if (choice.choice_num === 3) {
                this.stlist_service.selected_choices3.push(new_choice);
            } else if (choice.choice_num === 4) {
                this.stlist_service.selected_choices4.push(new_choice);
            }
        }
        this.stlist_service.sort();
    }

    isExtractChoice(choice) {
        const subcategories = this.stlist_service.subcategories[this.cat_service.selected_category._id];
        if (subcategories !== undefined) {
            const choices = this.stlist_service.choices[this.cat_service.selected_subcategory._id];
            if (choices !== undefined) {
                for (let i = 0; i < choices.length; i++) {
                    if (choices[i].choice._id === choice._id) {
                        return true;
                    }
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
        return false;
    }

    gotoContactUs() {
        const newWindow = this.nativeWindow.open('/weare/contactus',
            '_blank', 'width = 1024, height = 768, resizable=0, titlebar = false, toolbar = false, status = false');
    }
}
