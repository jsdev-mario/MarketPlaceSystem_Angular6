import { Component, OnInit } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {
    ButcherService, SpinnerService, SiteInfoService, ValidationService,
    WindowRef, SysAuthService, StatusService
} from '../../service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Constants from '../../service/constant';

declare var require: any;
const store = require('store');
const moment = require('moment');


declare var google: any;
declare var $: any;

@Component({
    selector: 'app-but-preference',
    templateUrl: './but-preference.component.html',
    styleUrls: ['./but-preference.component.css']
})
export class ButPreferenceComponent implements OnInit {

    native_window: any;

    day_names = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    phone_mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/,
        /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

    priceMask = createNumberMask({
        prefix: '£ ',
        allowDecimal: true,
        includeThousandsSeparator: false,
    });

    radiusMask = createNumberMask({
        prefix: '',
        suffix: ' mile',
        allowDecimal: true,
        includeThousandsSeparator: false,
    });

    estimate_times = [
        { id: 20, name: '20 min' },
        { id: 30, name: '30 min' },
        { id: 40, name: '40 min' },
        { id: 50, name: '50 min' },
        { id: 60, name: '60 min' },
    ];

    user: any;
    site_info: any;
    es_delivery_time: number;
    es_collection_time: number;
    min_collection_price: number;
    min_delivery_price: number;
    delivery_fee: number;
    delivery_radius: number;

    day_settings: any[] = [];

    map: any;
    mapCircle: any;

    provided_meattypes: string[] = [];
    shop_meattypes: string[] = [];

    selected_provided_meattype: string;
    selected_shop_meattype: string;

    shop_name: string;
    shop_phone: string;
    mobile_phone: string;
    email: string;
    shop_photo: string;
    shop_introduction: string;

    constructor(
        public but_service: ButcherService,
        public siteinfo_service: SiteInfoService,
        private router: Router,
        public spinner_service: SpinnerService,
        public toaster: ToastrService,
        public validation: ValidationService,
        public win_ref: WindowRef,
        public auth_service: SysAuthService,
        public status_service: StatusService,
    ) {
        this.user = store.get('user');
        this.site_info = store.get('site_info');
        if (!this.site_info) {
            this.siteinfo_service.getSiteInfo().then(data => {
                this.site_info = data;
                store.set('site_info', this.site_info);
                this.meatTypesInit();
            });
        }
        this.native_window = this.win_ref.getNativeWindow();
        this.status_service.events.emit({
            message: Constants.eventNames.HEADER_STYLE,
            header_style: 1
        });
    }

    ngOnInit() {
        for (let i = 0; i < 7; i++) {
            this.day_settings.push({
                open: true,
                has_delivery: false,
                opening_time: moment({ hour: 10, minute: 0 }).toDate(),
                closing_time: moment({ hour: 19, minute: 0 }).toDate(),
                start_time: moment({ hour: 10, minute: 0 }).toDate(),
                end_time: moment({ hour: 19, minute: 0 }).toDate(),
            });
        }
        if (this.user) {
            this.es_delivery_time = this.user.shop.delivery_time;
            this.es_collection_time = this.user.shop.collection_time;
            this.min_delivery_price = this.user.shop.min_delivery_price;
            this.min_collection_price = this.user.shop.min_collection_price;
            this.delivery_fee = this.user.shop.delivery_fee;
            this.delivery_radius = this.user.shop.delivery_radius;
            this.mobile_phone = this.user.mobile_phone;
            this.email = this.user.email;
            if (this.user.shop) {
                if (this.user.shop.day_settings.length > 0) {
                    this.day_settings = this.user.shop.day_settings;
                }
                this.shop_name = this.user.shop.shop_name;
                this.shop_photo = this.user.shop.shop_logo;
                this.shop_phone = this.user.shop.shop_phone;
                this.shop_introduction = this.user.shop.shop_introduction;
            }
            if (!this.es_delivery_time) {
                this.es_delivery_time = 20;
            }
            if (!this.es_collection_time) {
                this.es_collection_time = 20;
            }
            this.shop_meattypes = this.user.shop.meat_types;
            this.meatTypesInit();
            this.mapInit();
        }
    }

    meatTypesInit() {
        if (this.site_info) {
            this.site_info.meat_types.forEach(provided_meattype => {
                let flag = true;
                this.shop_meattypes.forEach(shop_meattype => {
                    if (provided_meattype === shop_meattype) {
                        flag = false;
                    }
                });
                if (flag) {
                    this.provided_meattypes.push(provided_meattype);
                }
            });
        }
    }

    mapInit() {
        const latLon = new google.maps.LatLng(this.user.shop.location.latitude,
            this.user.shop.location.longitude);
        const mapProp = {
            center: latLon,
            zoom: 11,
        };
        this.map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
        const marker = new google.maps.Marker({
            position: latLon,
            map: this.map,
            // icon: icon,
            title: this.user.shop.shop_name,
            label: {
                color: 'red',
                fontWeight: 'bold',
                text: this.displayAddress(),
            },
            icon: {
                labelOrigin: new google.maps.Point(11, 50),
                url: 'assets/images/mapmaker.png',
                scaledSize: new google.maps.Size(25, 40),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(11, 40),
            },
        });
        const infowindow = new google.maps.InfoWindow({
            content: this.user.shop.shop_name
        });
        infowindow.open(this.map, marker);
        marker.addListener('click', function () {
            infowindow.open(this.map, marker);
        });
        this.drawMapCircle();
    }

    drawMapCircle() {
        if (this.delivery_radius) {
            if (String(this.delivery_radius).indexOf('mile') > -1) {
                this.delivery_radius = Number(String(this.delivery_radius).split(' mile')[0]);
            }
            if (this.mapCircle) {
                this.mapCircle.setMap(null);
            }
            this.mapCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.5,
                strokeWeight: 1,
                fillColor: '#FF0000',
                fillOpacity: 0.2,
                map: this.map,
                center: new google.maps.LatLng(this.user.shop.location.latitude,
                    this.user.shop.location.longitude),
                radius: 1609.34 * this.delivery_radius,
            });
        }
    }

    displayDay(index: number) {
        return this.day_names[index];
    }

    validateDaySettings() {
        for (let i = 0; i < this.day_settings.length; i++) {
            const setting = this.day_settings[i];
            setting.opening_time = moment({
                hour: moment(setting.opening_time).hours(),
                minute: moment(setting.opening_time).minutes()
            }).toDate();
            setting.closing_time = moment({
                hour: moment(setting.closing_time).hours(),
                minute: moment(setting.closing_time).minutes()
            }).toDate();
            setting.start_time = moment({
                hour: moment(setting.start_time).hours(),
                minute: moment(setting.start_time).minutes()
            }).toDate();
            setting.end_time = moment({
                hour: moment(setting.end_time).hours(),
                minute: moment(setting.end_time).minutes()
            }).toDate();
            if (setting.open) {
                if (setting.closing_time <= setting.opening_time) {
                    this.toaster.error(this.displayDay(i) + ' Setting invalidate.', 'error');
                    return false;
                }
                if (setting.has_delivery) {
                    if (setting.start_time < setting.opening_time
                        || setting.end_time <= setting.start_time
                        || setting.end_time > setting.closing_time) {
                        this.toaster.error(this.displayDay(i) + ' Setting invalidate.', 'error');
                        return false;
                    }
                }
            }
        }
        return true;
    }

    esDeliveryTime(event) {
        console.log(this.es_delivery_time);
    }

    esCollectionTime(event) {
        console.log(this.es_collection_time);
    }

    displayTime(setting: any) {
        if (setting.open) {
            return moment(setting.opening_time).format('h:mm A') + ' - ' + moment(setting.closing_time).format('h:mm A');
        } else {
            return 'Closed';
        }
    }

    displayTodayShopTime() {
        let day = moment().day();
        const c_time = new Date().getTime();
        let str = '';
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        if (this.user && this.user.shop) {
            const day_setting = this.day_settings[day];
            if (!day_setting.open) {
                return 'Closed';
            }
            const opening_time = new Date(day_setting.opening_time).getTime();
            const closing_time = new Date(day_setting.closing_time).getTime();
            str += 'Open today: ' + moment(day_setting.opening_time).format('h:mm A')
                + ' - ' + moment(day_setting.closing_time).format('h:mm A');
            return str;
        }
    }

    displayAbbreName() {
        let abbr_name = this.user.shop.shop_name.split(' ')[0].charAt(0);
        if (this.user.shop.shop_name.split(' ').length > 1) {
            abbr_name += this.user.shop.shop_name.split(' ')[1].charAt(0);
        }
        return abbr_name;
    }

    displayDeliveryFee() {
        if (this.delivery_fee !== undefined) {
            if (String(this.delivery_fee) === '') {
                return 'Free';
            }
            if (this.delivery_fee <= 0 || String(this.delivery_fee) === '£ 0') {
                return 'Free';
            }
            if (String(this.delivery_fee).indexOf('£') > -1) {
                return String(this.delivery_fee);
            } else {
                return '£ ' + Number(this.delivery_fee).toFixed(2);
            }
        }
        return 'Free';
    }

    displayDeliveryPrice(price) {
        if (!price === undefined || price === '' || price === null) {
            return 'XX';
        }
        if (String(price).indexOf('£') > -1) {
            return price = Number(String(price).split('£ ')[1]);
        }
        return Number(price).toFixed(2);
    }

    //////
    selectProvidedMeatType(meat_type) {
        if (this.selected_provided_meattype !== meat_type) {
            this.selected_provided_meattype = meat_type;
        } else {
            this.selected_provided_meattype = undefined;
        }
        this.selected_shop_meattype = undefined;
    }

    selectShopMeatType(meat_type) {
        if (this.selected_shop_meattype !== meat_type) {
            this.selected_shop_meattype = meat_type;
        } else {
            this.selected_shop_meattype = undefined;
        }
        this.selected_provided_meattype = undefined;
    }

    addMeatType() {
        if (!this.selected_provided_meattype) {
            return;
        }
        this.shop_meattypes.push(this.selected_provided_meattype);
        for (let i = 0; i < this.provided_meattypes.length; i++) {
            if (this.provided_meattypes[i] === this.selected_provided_meattype) {
                this.provided_meattypes.splice(i, 1);
                this.selected_provided_meattype = undefined;
            }
        }
        this.shop_meattypes.sort(this.stringSort);
        this.provided_meattypes.sort(this.stringSort);
    }

    removeMeatType() {
        if (!this.selected_shop_meattype) {
            return;
        }
        this.provided_meattypes.push(this.selected_shop_meattype);
        for (let i = 0; i < this.shop_meattypes.length; i++) {
            if (this.shop_meattypes[i] === this.selected_shop_meattype) {
                this.shop_meattypes.splice(i, 1);
                this.selected_shop_meattype = undefined;
            }
        }
        this.shop_meattypes.sort(this.stringSort);
        this.provided_meattypes.sort(this.stringSort);
    }

    stringSort(a: any, b: any) {
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        }
        return 0;
    }

    displayMeatType() {
        let str = '';
        this.shop_meattypes.forEach(element => {
            str += element + ', ';
        });
        return str.trim().slice(0, -1);
    }

    displayAddress() {
        let address = this.user.shop.address_line1;
        if (this.user.shop.address_line2 !== undefined && this.user.shop.address_line2 !== '') {
            address += ', ' + this.user.shop.address_line2;
        }
        address += ', ' + this.user.shop.town_city + ', ' + this.user.shop.post_code;
        return address.trim();
    }

    ownerNameDisplay() {
        if (this.user.title !== 4) {
            return Constants.titles[this.user.title] + ' ' + this.user.first_name + ' ' + this.user.last_name;
        } else {
            return this.user.first_name + ' ' + this.user.last_name;
        }
    }

    uploadProfilePhoto(event) {
        const file_browser = event.target;
        if (file_browser.files && file_browser.files[0]) {
            const img = new Image();
            img.src = window.URL.createObjectURL(file_browser.files[0]);
            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                console.log(width);
                console.log(height);
                window.URL.revokeObjectURL(img.src);
                if (width === 400 && height === 400) {
                    const form_data: FormData = new FormData();
                    form_data.append('image', file_browser.files[0]);
                    this.spinner_service.show();
                    this.but_service.uploadFile(form_data).then(data => {
                        this.spinner_service.hide();
                        this.toaster.success('Profile picture uploaded', 'Success');
                        $('input[type=file]').val('');
                        this.shop_photo = data;
                        console.log(this.shop_photo);
                    }).catch(error => {
                        this.spinner_service.hide();
                        this.toaster.error('Profile picture upload fail. try again', 'Error');
                        console.log(error);
                    });
                    return;
                } else {
                    this.toaster.error('Picture format is invalid!', 'Error');
                    return;
                }
            };
        }
    }

    removeProfilePhoto() {
        if (this.shop_photo) {
            this.shop_photo = undefined;
            this.toaster.success('Profile picture removed', 'Success');
        }
    }

    save() {
        if (!this.user) {
            this.toaster.error('Please login.', 'Error');
            return;
        }

        if (this.shop_meattypes.length === 0) {
            this.toaster.error('Please select your shop meat types', 'Error');
            return;
        }

        if (!this.email || this.email === '') {
            this.toaster.error('Please input email', 'Error');
            return;
        }

        if (!this.validation.emailValidate(this.email)) {
            this.toaster.error('invalid email', 'Error');
            return;
        }

        if (!this.mobile_phone || this.mobile_phone === '') {
            this.toaster.error('Please input mobile phone number', 'Error');
            return;
        }

        if (!this.shop_phone || this.shop_phone === '') {
            this.toaster.error('Please input shop number', 'Error');
            return;
        }

        if (this.min_collection_price === undefined || String(this.min_collection_price) === '') {
            this.toaster.error('Please input minimum order price for collection', 'Error');
            return;
        }

        if (this.min_delivery_price === undefined || String(this.min_delivery_price) === '') {
            this.toaster.error('Please input minimum order price for home delivery', 'Error');
            return;
        }

        if (this.delivery_fee === undefined || String(this.delivery_fee) === '') {
            this.toaster.error('Please input delivery charge price', 'Error');
            return;
        }
        if (this.delivery_radius === undefined || String(this.delivery_radius) === '') {
            this.toaster.error('Please input delivery radius', 'Error');
            return;
        }

        if (String(this.min_delivery_price).indexOf('£') > -1) {
            this.min_delivery_price = Number(String(this.min_delivery_price).split('£ ')[1]);
        }

        if (String(this.min_collection_price).indexOf('£') > -1) {
            this.min_collection_price = Number(String(this.min_collection_price).split('£ ')[1]);
        }

        if (String(this.delivery_fee).indexOf('£') > -1) {
            this.delivery_fee = Number(String(this.delivery_fee).split('£ ')[1]);
        }

        if (String(this.delivery_radius).indexOf('mile') > -1) {
            this.delivery_radius = Number(String(this.delivery_radius).split(' mile')[0]);
        }

        if (!this.validateDaySettings()) {
            return;
        }

        const param: any = {
            shop_id: this.user.shop._id,
            min_delivery_price: this.min_delivery_price,
            min_collection_price: this.min_collection_price,
            delivery_time: this.es_delivery_time,
            collection_time: this.es_collection_time,
            delivery_fee: this.delivery_fee,
            delivery_radius: this.delivery_radius,
            day_settings: this.day_settings,
            meat_types: this.shop_meattypes,
            shop_phone: this.shop_phone,
            shop_introduction: this.shop_introduction,
        };
        if (this.shop_photo) {
            param.shop_logo = this.shop_photo;
        }
        const profile_param = {
            email: this.email,
            mobile_phone: this.mobile_phone,
        };
        this.spinner_service.show();
        this.but_service.updateShop(param).then(data => {
            this.but_service.updateProfile(profile_param).then(user => {
                this.spinner_service.hide();
                this.user = user;
                store.set('user', this.user);
                this.toaster.success('Preference updated', 'Success');
            }).catch(error => {
                this.spinner_service.hide();
                if (error.error && error.error.message) {
                    this.toaster.error(error.error.message, 'Error');
                }
            });
        }).catch(error => {
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    numberFormat(event) {
        if (event.target.value === '') {
            return 0;
        }
        let value = 0;
        if (event.target.value.indexOf('£') > -1) {
            value = Number(event.target.value.split('£ ')[1]);
        }
        return value;
    }


    gotoContactUs() {
        const newWindow = this.native_window.open('/weare/contactus',
            '_blank', 'width = 1024, height = 768, resizable=0, titlebar = false, toolbar = false, status = false');
    }

    canDeactivate() {
        const confirm_dlg =
            window.confirm('Are you sure you want to leave this page?\r\n Any changes will be lost if you navigate away from this page.');
        if (confirm_dlg) {
            if (this.status_service.logout_delay) {
                this.auth_service.logout();
            }
            return true;
        } else {
            this.status_service.logout_delay = false;
            return false;
        }
    }
}


