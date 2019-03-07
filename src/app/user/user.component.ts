import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Constants from '../service/constant';
import { StatusService } from '../service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
declare var require: any;
const store = require('store');

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterContentChecked, OnDestroy {

    user: any;
    header_style = 0;

    constructor(
        public router: Router,
        public status_service: StatusService,
    ) {
        this.user = store.get('user');
        this.status_service.events.subscribe(data => {
            if (data.message === Constants.eventNames.HEADER_STYLE) {
                this.header_style = data.header_style;
                if (!this.user) {
                    this.header_style = 0;
                }
            }
        });
    }

    ngOnInit() {

    }

    ngOnDestroy(): void {
        // this.status_service.events.unsubscribe();
    }

    ngAfterContentChecked() {
        this.user = store.get('user');
    }
}
