import { Component, OnInit } from '@angular/core';
import { MenuService, StatusService } from '../../../service';
declare var StickySidebar: any;
declare var $: any;

@Component({
    selector: 'app-menu-category',
    templateUrl: './menu-category.component.html',
    styleUrls: ['./menu-category.component.css']
})
export class MenuCategoryComponent implements OnInit {

    constructor(
        public menu_service: MenuService,
        public status_service: StatusService,
    ) { }

    ngOnInit() {

    }

    selectCategory(category) {
        this.menu_service.selected_content_section = 0;
        this.menu_service.selectCategory(category);
        this.status_service.menuStickybarUpdate();
    }
}
