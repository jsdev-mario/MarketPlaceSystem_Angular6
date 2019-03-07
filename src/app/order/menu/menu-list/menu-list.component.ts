import {
    Component, OnInit, ViewChild, AfterViewInit, AfterContentInit,
    SimpleChanges, OnChanges, AfterViewChecked, OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService, MenuService, SearchService, StatusService } from '../../../service';
import swal from 'sweetalert2';
const store = require('store');
const moment = require('moment');
declare var google: any;
declare var $: any;


@Component({
    selector: 'app-menu-list',
    templateUrl: './menu-list.component.html',
    styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit, AfterViewChecked, OnDestroy {

    number_mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/,
        /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

    days: string[] = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];
    open_times_str: string[] = [];
    delavailable_str: string[] = [];
    delivery_times_str: string[] = [];

    map: any;
    mapCircle: any;

    selected_butcher: any;
    day_setting: any;
    is_open = true;

    selected_tab = 0;

    choice_display = false;
    selected_orderitem: any;
    choice1_items: any[] = [];
    choice2_items: any[] = [];
    choice3_items: any[] = [];
    choice4_items: any[] = [];
    selected_choice1_no: number;
    selected_choice2_no: number;
    selected_choice3_no: number;
    selected_choice4_no: number;

    sticky_flag = true;

    routersub: any;

    constructor(
        private router: Router,
        public order_service: OrderService,
        public search_service: SearchService,
        public menu_service: MenuService,
        public status_service: StatusService,
        public active_router: ActivatedRoute,
    ) {
        this.routersub = this.active_router.params.subscribe(params => {
            this.initData();
        });
    }

    initData() {
        if (store.get('selected_butcher')) {
            this.selected_butcher = store.get('selected_butcher');
        }
        if (!this.search_service.post_code) {
            this.search_service.post_code = store.get('search_postcode');
        } else {
            store.set('search_postcode', this.search_service.post_code);
        }
        if (!this.search_service.location) {
            this.search_service.location = store.get('search_location');
        } else {
            store.set('search_location', this.search_service.location);
        }
        this.menu_service.selected_content_section = 0;
    }

    ngOnInit() {
        for (let i = 0; i < 7; i++) {
            const day_setting = this.selected_butcher.shop.day_settings[i];
            if (!day_setting.open) {
                this.open_times_str.push('Closed');
                this.delavailable_str.push('');
                this.delivery_times_str.push('');
            } else {
                this.open_times_str.push(`${moment(day_setting.opening_time).format('h:mm A')}
                         - ${moment(day_setting.closing_time).format('h:mm A')}`);
                if (day_setting.has_delivery) {
                    this.delavailable_str.push('Delivery Available');
                    this.delivery_times_str.push(`${moment(day_setting.start_time).format('h:mm A')}
                         - ${moment(day_setting.end_time).format('h:mm A')}`);
                } else {
                    this.delavailable_str.push('Collection Only');
                    this.delivery_times_str.push('');
                }
            }
        }
        this.displayOpenTime();
        this.mapInit();
    }

    ngOnDestroy(): void {
        this.routersub.unsubscribe();
    }

    ngAfterViewChecked() {
        if (this.menu_service.menu && this.sticky_flag) {
            this.sticky_flag = false;
            this.status_service.menuStickybarInit();
        }
    }

    mapInit() {
        setTimeout(() => {
            const latLon = new google.maps.LatLng(this.selected_butcher.shop.location.latitude,
                this.selected_butcher.shop.location.longitude);
            const mapProp = {
                center: latLon,
                zoom: 11,
            };
            this.map = new google.maps.Map(document.getElementById('findusMap'), mapProp);
            const marker = new google.maps.Marker({
                position: latLon,
                map: this.map,
                title: this.selected_butcher.shop.shop_name,
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
                content: this.selected_butcher.shop.shop_name
            });
            infowindow.open(this.map, marker);
            marker.addListener('click', function () {
                infowindow.open(this.map, marker);
            });
            this.drawMapCircle();
        }, 2000);
    }

    displayAddress() {
        let address = this.selected_butcher.shop.address_line1;
        if (this.selected_butcher.shop.address_line2 !== undefined && this.selected_butcher.shop.address_line2 !== '') {
            address += ', ' + this.selected_butcher.shop.address_line2;
        }
        address += ', ' + this.selected_butcher.shop.town_city + ', ' + this.selected_butcher.shop.post_code;
        return address.trim();
    }

    drawMapCircle() {
        if (this.selected_butcher.shop.delivery_radius) {
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
                center: new google.maps.LatLng(this.selected_butcher.shop.location.latitude,
                    this.selected_butcher.shop.location.longitude),
                radius: 1609.34 * this.selected_butcher.shop.delivery_radius,
            });
        }
    }

    selectGrocery() {
        this.menu_service.selected_content_section = 0;
        this.status_service.menuStickybarUpdate();
    }

    selectAboutUs() {
        this.menu_service.selected_content_section = 1;
        this.status_service.menuStickybarUpdate();
        this.mapInit();
    }

    displayAbbreName() {
        let abbr_name = this.selected_butcher.shop.shop_name.split(' ')[0].charAt(0);
        if (this.selected_butcher.shop.shop_name.split(' ').length > 1) {
            abbr_name += this.selected_butcher.shop.shop_name.split(' ')[1].charAt(0);
        }
        return abbr_name;
    }

    displayMeatType() {
        if (this.selected_butcher) {
            let meat_types = '';
            this.selected_butcher.shop.meat_types.forEach(element => {
                meat_types += element + ', ';
            });
            return meat_types.slice(0, -2);
        }
        return '';
    }

    displayOpenTime() {
        let day = moment().day();
        const c_time = this.getMinutesNumber(new Date());
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        if (this.selected_butcher && this.selected_butcher.shop) {
            this.day_setting = this.selected_butcher.shop.day_settings[day];
            const opening_time = this.getMinutesNumber(new Date(this.day_setting.opening_time));
            const closing_time = this.getMinutesNumber(new Date(this.day_setting.closing_time));
            if (!this.day_setting.open || c_time > closing_time) {
                const next_day = this.nextOpenDay();
                this.day_setting = this.selected_butcher.shop.day_settings[next_day];
                this.is_open = false;
                return `Opening ${this.days[next_day]} ${moment(this.day_setting.opening_time).format('h:mm A')}`;
            } else {
                if (c_time < opening_time) {
                    this.is_open = false;
                    return `Opening at ${moment(this.day_setting.opening_time).format('h:mm A')}`;
                } else {
                    this.is_open = true;
                    return `Open Today ${moment(this.day_setting.opening_time).format('h:mm A')} -
                     ${moment(this.day_setting.closing_time).format('h:mm A')}`;
                }
            }
        }
    }

    hasDeliveryOption() {
        let day = moment().day();
        const c_time = this.getMinutesNumber(new Date());
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        let delivery_day_setting: any;
        if (this.selected_butcher && this.selected_butcher.shop) {
            delivery_day_setting = this.selected_butcher.shop.day_settings[day];
            const start_time = this.getMinutesNumber(new Date(delivery_day_setting.start_time));
            const end_time = this.getMinutesNumber(new Date(delivery_day_setting.end_time));
            if (!delivery_day_setting.open || c_time > end_time || !delivery_day_setting.has_delivery) {
                const next_day = this.nextStartDay();
                delivery_day_setting = this.selected_butcher.shop.day_settings[next_day];
                if (day === next_day && !delivery_day_setting.open) {
                    delivery_day_setting.has_delivery = false;
                }
            }
        }
        return delivery_day_setting.has_delivery;
    }

    nextStartDay() {
        let day = moment().day();
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        for (let i = 1; i <= 6; i++) {
            const next_day = (i + day) % 7;
            if (this.selected_butcher.shop.day_settings[next_day].open && this.selected_butcher.shop.day_settings[next_day].has_delivery) {
                return next_day;
            }
        }
        return day;
    }

    nextOpenDay() {
        let day = moment().day();
        if (day === 0) {
            day = 6;
        } else {
            day--;
        }
        for (let i = 1; i < 6; i++) {
            const next_day = (i + day) % 6;
            if (this.selected_butcher.shop.day_settings[next_day].open) {
                return next_day;
            }
        }
        return day;
    }

    getMinutesNumber(date) {
        return date.getHours() * 60 + date.getMinutes();
    }

    unit(subcategory) {
        let unit = 'Each';
        if (subcategory.unit === 1) {
            unit = 'Kg';
        } else if (subcategory.unit === 2) {
            unit = 'g';
        }
        return unit;
    }

    additioanlInfoMenu(subcategory) {
        let menu_name = '';
        if (!subcategory.is_available) {
            return 'SOLD OUT';
        }
        if (this.unit(subcategory) !== 'Each') {
            menu_name += `${subcategory.qty} `;
        }
        return menu_name + `${this.unit(subcategory)}`;
    }

    offer(subcategory) {
        if (subcategory.offer) {
            let unit = 'Each';
            if (subcategory.unit === 1) {
                unit = 'Kg';
            } else if (subcategory.unit === 2) {
                unit = 'g';
            }
            return `Offer ${subcategory.offer.qty} for £ ${subcategory.offer.price.toFixed(2)}
            - Save £ ${(subcategory.price * subcategory.offer.qty - subcategory.offer.price).toFixed(2)}`;
        }
        return '';
    }

    sortPrice(a, b) {
        if (a.amount > b.amount) {
            return 1;
        } else if (a.amount < b.amount) {
            return -1;
        }
        return 0;
    }

    addMenu(subcategory) {
        if (!this.is_open) {
            swal({
                title: '',
                text: `${this.selected_butcher.shop.shop_name} is currently closed at the moment.
                \r\n Please search for other local butchers`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#F6931D',
                cancelButtonColor: 'grey',
                confirmButtonText: 'New Search',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.value) {
                    this.router.navigate(['/order/search']);
                }
            });
            return;
        }
        if (this.order_service.current_order === undefined) {
            this.order_service.current_order = {};
            this.order_service.current_order.order_items = [];
            this.order_service.current_order.delivery_option = 0;
            if (this.hasDeliveryOption()) {
                this.order_service.current_order.delivery_option = 1;
            }
            this.order_service.current_order.note = '';
            this.order_service.current_order.butcher = this.selected_butcher;
            store.set('current_order', this.order_service.current_order);
            this.addMenuProc(subcategory);
            return;
        }
        if (this.order_service.current_order.butcher._id !== this.selected_butcher._id) {
            if (this.order_service.current_order.order_items.length === 0) {
                this.order_service.current_order = {};
                this.order_service.current_order.delivery_option = 0;
                if (this.hasDeliveryOption()) {
                    this.order_service.current_order.delivery_option = 1;
                }
                this.order_service.current_order.note = '';
                this.order_service.current_order.butcher = this.selected_butcher;
                this.order_service.current_order.order_items = [];
                store.set('current_order', this.order_service.current_order);
            }
            this.addMenuProc(subcategory);
        } else {
            this.addMenuProc(subcategory);
        }
    }

    addMenuProc(subcategory) {
        this.selected_orderitem = {};
        this.selected_orderitem.count = 1;
        this.selected_orderitem.choices = [];
        this.selected_orderitem.product = subcategory;
        this.selected_orderitem.sub_price = subcategory.price;
        const choices = this.menu_service.getChoices(subcategory);
        this.selected_choice1_no = undefined;
        this.selected_choice2_no = undefined;
        this.selected_choice3_no = undefined;
        this.selected_choice4_no = undefined;
        choices.forEach(element => {
            switch (element.choice_num) {
                case 1:
                    this.choice1_items.push({
                        id: this.choice1_items.length,
                        name: element.name,
                        choice_num: element.choice_num,
                        price: element.price,
                    });
                    break;
                case 2:
                    this.choice2_items.push({
                        id: this.choice2_items.length,
                        name: element.name,
                        choice_num: element.choice_num,
                        price: element.price,
                    });
                    break;
                case 3:
                    this.choice3_items.push({
                        id: this.choice3_items.length,
                        name: element.name,
                        choice_num: element.choice_num,
                        price: element.price,
                    });
                    break;
                case 4:
                    this.choice4_items.push({
                        id: this.choice4_items.length,
                        name: element.name,
                        choice_num: element.choice_num,
                        price: element.price,
                    });
                    break;
            }
        });
        this.choice_display = true;
    }

    selectChoice1() {
        const selected_choice1 = this.choice1_items[this.selected_choice1_no];
        let flag = true;
        this.selected_orderitem.choices.forEach((element, index) => {
            if (element.choice_num === selected_choice1.choice_num) {
                element.name = selected_choice1.name;
                element.price = selected_choice1.price;
                flag = false;
            }
        });
        if (flag) {
            this.selected_orderitem.choices.push({
                name: selected_choice1.name,
                choice_num: selected_choice1.choice_num,
                price: selected_choice1.price
            });
        }
        this.order_service.calOrderItemPrice(this.selected_orderitem);
    }

    selectChoice2() {
        const selected_choice2 = this.choice2_items[this.selected_choice2_no];
        let flag = true;
        this.selected_orderitem.choices.forEach((element, index) => {
            if (element.choice_num === selected_choice2.choice_num) {
                element.name = selected_choice2.name;
                element.price = selected_choice2.price;
                flag = false;
            }
        });
        if (flag) {
            this.selected_orderitem.choices.push({
                name: selected_choice2.name,
                choice_num: selected_choice2.choice_num,
                price: selected_choice2.price
            });
        }
        this.order_service.calOrderItemPrice(this.selected_orderitem);
    }

    selectChoice3() {
        const selected_choice3 = this.choice3_items[this.selected_choice3_no];
        let flag = true;
        this.selected_orderitem.choices.forEach((element, index) => {
            if (element.choice_num === selected_choice3.choice_num) {
                element.name = selected_choice3.name;
                element.price = selected_choice3.price;
                flag = false;
            }
        });
        if (flag) {
            this.selected_orderitem.choices.push({
                name: selected_choice3.name,
                choice_num: selected_choice3.choice_num,
                price: selected_choice3.price
            });
        }
        this.order_service.calOrderItemPrice(this.selected_orderitem);
    }

    selectChoice4() {
        const selected_choice4 = this.choice4_items[this.selected_choice4_no];
        let flag = true;
        this.selected_orderitem.choices.forEach((element, index) => {
            if (element.choice_num === selected_choice4.choice_num) {
                element.name = selected_choice4.name;
                element.price = selected_choice4.price;
                flag = false;
            }
        });
        if (flag) {
            this.selected_orderitem.choices.push({
                name: selected_choice4.name,
                choice_num: selected_choice4.choice_num,
                price: selected_choice4.price
            });
        }
        this.order_service.calOrderItemPrice(this.selected_orderitem);
    }

    choiceSort(a, b) {
        if (a.choice_num > b.choice_num) {
            return 1;
        }
        if (a.choice_num < b.choice_num) {
            return -1;
        }
        return 0;
    }

    orderItemFilter() {
        const temp_order_items: any[] = [];
        for (let i = 0; i < this.order_service.current_order.order_items.length; i++) {
            const order_item = this.order_service.current_order.order_items[i];
            const same_order_item = this.isExistOrderItem(temp_order_items, order_item);
            if (same_order_item) {
                same_order_item.count += Number(order_item.count);
            } else {
                temp_order_items.push(order_item);
            }
        }
        this.order_service.current_order.order_items = temp_order_items;
    }

    isExistOrderItem(orderitem_array, order_item) {
        for (let i = 0; i < orderitem_array.length; i++) {
            if (orderitem_array[i].product.subcategory._id === order_item.product.subcategory._id
                && this.equalChoices(orderitem_array[i], order_item)) {
                return orderitem_array[i];
            }
        }
        return undefined;
    }

    equalChoices(order_itemone, order_itemtwo) {
        const choiceones = order_itemone.choices;
        const choicetwos = order_itemtwo.choices;
        if (choiceones.length === choicetwos.length) {
            for (let j = 0; j < choiceones.length; j++) {
                let flag = true;
                for (let k = 0; k < choicetwos.length; k++) {
                    if (choiceones[j].name.toLowerCase() === choicetwos[k].name.toLowerCase()
                        && choiceones[j].choice_num === choicetwos[k].choice_num) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    choiceOk() {
        this.choice_display = false;
        if (this.order_service.current_order.butcher._id !== this.selected_butcher._id) {
            swal({
                title: '',
                text: `This will empty your existing basket with ${this.order_service.current_order.butcher.shop.shop_name}
                    and begin a new one with new ${this.selected_butcher.shop.shop_name}`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#F6931D',
                cancelButtonColor: 'grey',
                confirmButtonText: 'Create New Basket',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.value) {
                    this.order_service.current_order = {};
                    this.order_service.current_order.delivery_option = 0;
                    if (this.hasDeliveryOption()) {
                        this.order_service.current_order.delivery_option = 1;
                    }
                    this.order_service.current_order.note = '';
                    this.order_service.current_order.butcher = this.selected_butcher;
                    this.order_service.current_order.order_items = [];
                    this.selected_orderitem.choices.sort(this.choiceSort);
                    this.selected_orderitem.count = Number(this.selected_orderitem.count);
                    this.order_service.current_order.order_items.push(this.selected_orderitem);
                    this.orderItemFilter();
                    store.set('current_order', this.order_service.current_order);
                    this.resetChoice();
                } else {
                    this.resetChoice();
                }
            });
        } else {
            this.selected_orderitem.choices.sort(this.choiceSort);
            this.selected_orderitem.count = Number(this.selected_orderitem.count);
            this.order_service.current_order.order_items.push(this.selected_orderitem);
            this.orderItemFilter();
            store.set('current_order', this.order_service.current_order);
            this.resetChoice();
        }
    }

    choiceCancel() {
        this.choice_display = false;
        this.resetChoice();
    }

    resetChoice() {
        this.selected_orderitem = undefined;
        this.choice1_items = [];
        this.choice2_items = [];
        this.choice3_items = [];
        this.choice4_items = [];
        this.selected_choice1_no = undefined;
        this.selected_choice2_no = undefined;
        this.selected_choice3_no = undefined;
        this.selected_choice4_no = undefined;
    }

    countDecrease() {
        if (this.selected_orderitem.count > 1) {
            this.selected_orderitem.count--;
            this.order_service.calOrderItemPrice(this.selected_orderitem);
        }
    }

    countIncrease() {
        this.selected_orderitem.count++;
        this.order_service.calOrderItemPrice(this.selected_orderitem);
    }

    inputCount(event) {
        this.selected_orderitem.count = Number(event.target.value);
        if (this.selected_orderitem.count === 0) {
            this.selected_orderitem.count = 1;
        }
        event.target.value = this.selected_orderitem.count;
        this.order_service.calOrderItemPrice(this.selected_orderitem);
    }

    canAdd() {
        let choice_count = 0;
        if (this.choice1_items.length > 0) {
            choice_count++;
        }
        if (this.choice2_items.length > 0) {
            choice_count++;
        }
        if (this.choice3_items.length > 0) {
            choice_count++;
        }
        if (this.choice4_items.length > 0) {
            choice_count++;
        }
        if (this.selected_orderitem.choices.length > 0 || choice_count === 0) {
            if (choice_count === this.selected_orderitem.choices.length) {
                return true;
            }
        }
        return false;
    }
}

