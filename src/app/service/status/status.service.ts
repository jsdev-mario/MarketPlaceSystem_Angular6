import { Injectable, EventEmitter } from '@angular/core';
declare var $: any;
declare var StickySidebar: any;

@Injectable()
export class StatusService {

    header_style = 0;
    fast_search = true;
    expend_menu = false;
    events: EventEmitter<any> = new EventEmitter<any>();

    logout_delay = false;
    menu_sidebar: any;
    cat_sidebar: any;

    constructor() { }

    menuStickybarInit() {
        this.menu_sidebar = new StickySidebar('#menu_sidebar', {
            containerSelector: '#main-content',
            innerWrapperSelector: '.sidebar__inner',
            topSpacing: 0,
            bottomSpacing: 20
        });
        this.cat_sidebar = new StickySidebar('#cat_sidebar', {
            containerSelector: '#main-content',
            innerWrapperSelector: '.sidebar__inner',
            topSpacing: 0,
            bottomSpacing: 20
        });
    }

    menuStickybarDestory() {
        if (this.menu_sidebar && this.cat_sidebar) {
            this.menu_sidebar.destroy();
            this.cat_sidebar.destroy();
            this.menu_sidebar = undefined;
            this.cat_sidebar = undefined;
        }
    }

    menuStickybarUpdate() {
        if (this.menu_sidebar && this.cat_sidebar) {
            this.menu_sidebar.updateSticky();
            this.cat_sidebar.updateSticky();
        }
    }

    playAlertSound() {
        const audio = new Audio();
        audio.src = 'assets/audios/alert.mp3';
        audio.load();
        audio.play();
    }
}
