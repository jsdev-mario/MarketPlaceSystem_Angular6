import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
declare var require: any;
const store = require('store');

@Injectable()
export class CustAuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (store.get('user')) {
            return true;
        }
        this.router.navigate(['/auth/login', 'customer'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}


@Injectable()
export class ButAuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (store.get('user')) {
            return true;
        }
        this.router.navigate(['/auth/login', 'butcher'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}

@Injectable()
export class PaymentGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (store.get('from_checktout')) {
            store.remove('from_checkout');
            return true;
        } else {
            if (store.get('selected_butcher')) {
                this.router.navigate(['order/menu', store.get('selected_butcher').shop.shop_name]);
            } else {
                this.router.navigate(['/order/search']);
            }
            return false;
        }
    }
}

@Injectable()
export class CheckoutGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (store.get('from_menu')) {
            store.remove('from_menu');
            return true;
        } else {
            if (store.get('selected_butcher')) {
                this.router.navigate(['order/menu', store.get('selected_butcher').shop.shop_name]);
            } else {
                this.router.navigate(['/order/search']);
            }
            return false;
        }
    }
}

