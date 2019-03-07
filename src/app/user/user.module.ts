import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule, FooterModule, ButheaderModule, OrderheaderModule } from '../shared';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { UserRoutingModule } from './user-routing.module';
import { StarRatingModule } from 'angular-star-rating';
import { UserComponent } from './user.component';
import { BsDatepickerModule, TimepickerModule, PaginationModule } from 'ngx-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ButProfileComponent } from './but-profile/but-profile.component';
import { ButPreferenceComponent } from './but-preference/but-preference.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ButStockListComponent } from './but-stock-list/but-stock-list.component';
import { GroceryListComponent} from './but-stock-list/grocery-list/grocery-list.component';
import { MyGroceryListComponent } from './but-stock-list/my-grocery-list/my-grocery-list.component';
import { OffersComponent } from './but-stock-list/offers/offers.component';
import { CustomerAccountComponent } from './customer-account/customer-account.component';
import { ProfileComponent } from './customer-account/profile/profile.component';
import { ManageAddressComponent } from './customer-account/manage-address/manage-address.component';
import { CustChangePasswordComponent } from './customer-account/cust-change-password/cust-change-password.component';
import { MyWalletComponent } from './customer-account/my-wallet/my-wallet.component';
import { DeleteAccountComponent } from './customer-account/delete-account/delete-account.component';
import { ButTodayOrderComponent } from './but-today-order/but-today-order.component';
import { ButChangePasswordComponent } from './but-change-password/but-change-password.component';
import { ButOrderHistoryComponent } from './but-order-history/but-order-history.component';
import { CustOrderHistoryComponent } from './cust-order/cust-order-history/cust-order-history.component';
import { CustOrderComponent } from './cust-order/cust-order.component';
import { CustTodayOrderComponent } from './cust-order/cust-today-order/cust-today-order.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { ButOrderControlComponent } from './order-view/but-order-control/but-order-control.component';
import { OrderDetailsComponent } from './order-view/order-details/order-details.component';
import { CustOrderControlComponent } from './order-view/cust-order-control/cust-order-control.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HeaderModule,
        ButheaderModule,
        OrderheaderModule,
        FooterModule,
        UserRoutingModule,
        RouterModule,
        NgSelectModule,
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        PaginationModule.forRoot(),
        StarRatingModule.forRoot(),
        TextMaskModule,
        UiSwitchModule,
    ],
    declarations: [
        CustomerAccountComponent,
        UserComponent,
        ButProfileComponent,
        ButPreferenceComponent,
        ChangePasswordComponent,
        ButStockListComponent,
        GroceryListComponent,
        MyGroceryListComponent,
        OffersComponent,
        CustomerAccountComponent,
        ProfileComponent,
        ManageAddressComponent,
        CustChangePasswordComponent,
        MyWalletComponent,
        DeleteAccountComponent,
        ButTodayOrderComponent,
        ButOrderHistoryComponent,
        CustOrderHistoryComponent,
        CustOrderComponent,
        CustTodayOrderComponent,
        OrderViewComponent,
        ButOrderControlComponent,
        OrderDetailsComponent,
        CustOrderControlComponent,
        ButChangePasswordComponent,
    ]
})
export class UserModule { }
