import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order.component';
import { SearchComponent } from './search/search.component';
import { MenuComponent } from './menu/menu.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent } from './payment/payment.component';
import { CustAuthGuard, PaymentGuard, CheckoutGuard } from '../guard';


const routes: Routes = [
    {
        path: '',
        component: OrderComponent,
        children: [
            { path: '', redirectTo: 'search' },
            { path: 'search', component: SearchComponent },
            { path: 'menu/:shopname', component: MenuComponent },
            { path: 'checkout', component: CheckoutComponent, canActivate: [CustAuthGuard, CheckoutGuard] },
            // { path: 'payment', component: PaymentComponent, canActivate: [CustAuthGuard, PaymentGuard] },
            { path: 'payment', component: PaymentComponent, canActivate: [CustAuthGuard] },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class OrderRoutingModule { }
