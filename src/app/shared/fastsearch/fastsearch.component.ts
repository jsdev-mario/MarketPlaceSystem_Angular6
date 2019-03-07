import { Component, OnInit } from '@angular/core';
import {SearchService, StatusService} from '../../service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-fastsearch',
    templateUrl: './fastsearch.component.html',
    styleUrls: ['./fastsearch.component.css']
})
export class FastsearchComponent implements OnInit {

    post_code: string;

    constructor(
        public search_service: SearchService,
        public status_service: StatusService,
        private router: Router,
    ) { }

    ngOnInit() {

    }

    search() {
        this.search_service.post_code = this.post_code;
        this.router.navigate(['/order']);
    }

}
