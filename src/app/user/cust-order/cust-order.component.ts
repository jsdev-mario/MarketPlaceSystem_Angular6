import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-cust-order',
    templateUrl: './cust-order.component.html',
    styleUrls: ['./cust-order.component.css']
})
export class CustOrderComponent implements OnInit {

    selected_today = true;

    constructor() { }

    ngOnInit() {
    }

    selToday() {
        this.selected_today = true;
    }

    selHistory() {
        this.selected_today = false;
    }

}
