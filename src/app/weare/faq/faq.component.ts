import { Component, OnInit } from '@angular/core';
import { StatusService } from '../../service';
import Constant from '../../service/constant';

declare var require: any;
declare var $: any;
const store = require('store');



@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

    public is_custfaq = true;

    constructor(
        public status_service: StatusService
    ) {
        this.status_service.fast_search = true;
        const user = store.get('user');
        if (user && user.user_type === Constant.userType.BUTCHER) {
            this.status_service.fast_search = false;
        }
    }

    ngOnInit() {
        this.initCousel();
    }

    selBtn() {
        this.is_custfaq = !this.is_custfaq;
        if (this.is_custfaq) {
            this.initCousel();
        }
    }

    initCousel() {
        $(document).ready(() => {
            $('.owl-carousel').owlCarousel({
                loop: true,
                margin: 20,
                nav: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    300: {
                        items: 2
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 5
                    }
                }
            });
        });
    }
}
