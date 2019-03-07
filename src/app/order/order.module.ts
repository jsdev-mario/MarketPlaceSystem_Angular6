import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule, FooterModule, ButcherModule } from '../shared/index';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NG_SELECT_DEFAULT_CONFIG } from '@ng-select/ng-select';
import { SearchComponent } from './search/search.component';
import { MenuComponent } from './menu/menu.component';
// import { RatingModule } from 'ngx-rating';
import { MenuCategoryComponent } from './menu/menu-category/menu-category.component';
import { MenuListComponent } from './menu/menu-list/menu-list.component';
import { MenuShopcartComponent } from './menu/menu-shopcart/menu-shopcart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { StarRatingModule } from 'angular-star-rating';
import { TextMaskModule } from 'angular2-text-mask';
import { HttpClientModule } from '@angular/common/http';
import { CheckoutOrderitemsComponent } from './checkout/checkout-orderitems/checkout-orderitems.component';
import { DeliveryInfodetailsComponent } from './checkout/delivery-infodetails/delivery-infodetails.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { PaymentComponent } from './payment/payment.component';
import { PlaceorderComponent } from './payment/placeorder/placeorder.component';



@NgModule({
    imports: [
        CommonModule,
        OrderRoutingModule,
        HeaderModule,
        FooterModule,
        ButcherModule,
        FormsModule,
        // RatingModule,
        NgSelectModule,
        TextMaskModule,
        StarRatingModule.forRoot(),
        HttpClientModule,
        UiSwitchModule,
    ],
    declarations: [
        OrderComponent,
        SearchComponent,
        MenuComponent,
        MenuCategoryComponent,
        MenuListComponent,
        MenuShopcartComponent,
        CheckoutComponent,
        CheckoutOrderitemsComponent,
        DeliveryInfodetailsComponent,
        PaymentComponent,
        PlaceorderComponent,
    ]
})
export class OrderModule { }
