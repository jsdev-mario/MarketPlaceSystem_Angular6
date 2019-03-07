import { Injectable } from '@angular/core';
import API_URL from '../api_url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class MenuService {

    selected_content_section = 1;

    menu: any;
    selected_category: any;
    selected_subcategories: any[];
    selected_subcategory: any;

    constructor(
        private http: HttpClient
    ) { }

    shopMenu(shopmenu_id): Promise<any> {
        this.menu = undefined;
        return this.http.post(API_URL.SHOP_MENU_GET, {shopmenu_id: shopmenu_id})
            .map((response) => <any[]>response['data'])
            .toPromise()
            .catch(error => {
                throw (error);
            });
    }
    order(order): Promise<String> {
        return this.http.post(API_URL.ORDER_ADD, order)
            .map((response) => <String>response['message'])
            .toPromise()
            .catch(error => {
                throw (error);
            });
    }

    setMenu(menu) {
        this.menu = menu;
        this.menu.categories.sort(this.categorySort);
        if (this.isExistMenu) {
            this.selectCategory(this.menu.categories[0]);
        }
    }

    isExistMenu() {
        if (this.menu && this.menu.categories.length > 0) {
            return true;
        }
        return false;
    }

    selectCategory(category) {
        this.selected_category = category;
        this.selected_subcategories = [];
        this.menu.subcategories.forEach(element => {
            if (element.subcategory.category_id === category._id) {
                this.selected_subcategories.push(element);
            }
        });
        this.selected_subcategories.sort(this.subcategorySort);
    }

    getChoices(subcategory) {
        const choices: any[] = [];
        this.menu.choices.forEach(element => {
            if (element.choice.subcategory_id === subcategory.subcategory._id) {
                choices.push({
                    name: element.choice.name,
                    choice_num: element.choice.choice_num,
                    price: element.price,
                });
            }
        });
        return choices.sort(this.choiceSort);
    }

    categorySort(a, b) {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        }
        return 0;
    }

    choiceSort(a, b) {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        }
        return 0;
    }

    subcategorySort(a, b) {
        if (a.subcategory.name > b.subcategory.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        }
        return 0;
    }

}
