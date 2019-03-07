import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
    selector: 'app-but-profile',
    templateUrl: './but-profile.component.html',
    styleUrls: ['./but-profile.component.css']
})
export class ButProfileComponent implements OnInit {

    mon_open_time: Date = new Date();
    mon_close_time: Date = new Date();

    constructor() { }

    ngOnInit() {
        function myMap() {
            const mapProp = {
                center: new google.maps.LatLng(51.508742, -0.120850),
                zoom: 5,
            };
            const map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
        }

    }

}
