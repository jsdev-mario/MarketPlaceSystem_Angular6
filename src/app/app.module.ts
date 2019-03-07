import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://206.189.16.222:80', options: {} };

import {
    CustAuthGuard,
    ButAuthGuard,
    TokenCheck,
    CanDeactivateGuard,
    PaymentGuard,
    CheckoutGuard
} from './guard';

import {
    SysAuthService,
    SiteInfoService,
    SearchService,
    OrderService,
    MenuService,
    CustomerService,
    ButcherService,
    StatusService,
    SpinnerService,
    ValidationService,
    CommonService,
    StocklistService,
    CategoryService,
    PaymentService,
    WindowRef,
    SocketService,
    SseService,
    ContactService,
} from './service';


import { AppComponent } from './app.component';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        ToastrModule.forRoot(),
        SocketIoModule.forRoot(config),
    ],
    providers: [
        SiteInfoService,
        SysAuthService,
        SearchService,
        OrderService,
        MenuService,
        CustomerService,
        ButcherService,
        StatusService,
        SpinnerService,
        CategoryService,
        StocklistService,
        ValidationService,
        CommonService,
        CustAuthGuard,
        ButAuthGuard,
        PaymentGuard,
        CheckoutGuard,
        TokenCheck,
        CanDeactivateGuard,
        WindowRef,
        PaymentService,
        SocketService,
        SseService,
        ContactService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
