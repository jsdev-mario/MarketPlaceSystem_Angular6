import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
declare var require: any;
const store = require('store');
import { JwtHelperService } from '@auth0/angular-jwt';
import { SysAuthService } from '../service';

@Injectable()
export class TokenCheck implements CanActivate {
    constructor(
        public auth_service: SysAuthService,
        private router: Router
    ) { }

    canActivate() {
        if (store.get('token')) {
            const token = store.get('token');
            const helper = new JwtHelperService();
            if (helper.isTokenExpired(token)) {
                this.auth_service.logout();
                store.remove('selected_butcher');
                store.remove('current_order');
            }
        }
        return true;
    }
}
