import { Component, OnInit } from '@angular/core';
import { StatusService } from '../../service';
import Constant from '../../service/constant';
const store = require('store');

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

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

    }

}
