import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { ButProfileComponent } from './but-profile/but-profile.component';
import { ButPreferenceComponent } from './but-preference/but-preference.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {CustAuthGuard, ButAuthGuard, CanDeactivateGuard} from '../guard';
import { ButStockListComponent } from './but-stock-list/but-stock-list.component';
import { ButTodayOrderComponent } from './but-today-order/but-today-order.component';
import { ButOrderHistoryComponent } from './but-order-history/but-order-history.component';
import { OrderViewComponent } from './order-view/order-view.component';


import { CustomerAccountComponent } from './customer-account/customer-account.component';
import { CustOrderComponent } from './cust-order/cust-order.component';
import { ButChangePasswordComponent } from './but-change-password/but-change-password.component';

const routes: Routes = [
    {
        path: '', component: UserComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: 'custaccount', component: CustomerAccountComponent, canActivate: [CustAuthGuard] },
            { path: 'custorder', component: CustOrderComponent, canActivate: [CustAuthGuard] },
            { path: 'butprofile', component: ButProfileComponent, canActivate: [ButAuthGuard]  },
            { path: 'butpreferences', component: ButPreferenceComponent, canActivate: [ButAuthGuard], canDeactivate: [CanDeactivateGuard]},
            { path: 'butstocklist', component: ButStockListComponent, canActivate: [ButAuthGuard], canDeactivate: [CanDeactivateGuard]  },
            { path: 'buttodayorder', component: ButTodayOrderComponent, canActivate: [ButAuthGuard]},
            { path: 'butorderhistory', component: ButOrderHistoryComponent, canActivate: [ButAuthGuard]},
            { path: 'butchangepass', component: ButChangePasswordComponent, canActivate: [ButAuthGuard]},
            { path: 'orderview/:order_id', component: OrderViewComponent, canActivate: [ButAuthGuard]},
            { path: 'passwordchange/:token', component: ChangePasswordComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
