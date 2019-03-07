import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule, FooterModule, FastsearchModule, ButheaderModule } from '../shared';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import {TextMaskModule} from 'angular2-text-mask';

import { WeareRoutingModule } from './weare-routing.module';
import { WeareComponent } from './weare.component';
import { ContactusComponent } from './contactus/contactus.component';
import { FaqComponent } from './faq/faq.component';
import { BlogComponent } from './blog/blog.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { PolicyComponent } from './policy/policy.component';
import { TermconditionComponent } from './termcondition/termcondition.component';
import { CustFaqComponent } from './faq/cust-faq/cust-faq.component';
import { ButFaqComponent } from './faq/but-faq/but-faq.component';

@NgModule({
    imports: [
        CommonModule,
        WeareRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HeaderModule,
        FooterModule,
        FastsearchModule,
        NgSelectModule,
        TextMaskModule,
        ButheaderModule,
    ],
    declarations: [
        WeareComponent,
        ContactusComponent,
        FaqComponent,
        BlogComponent,
        AboutusComponent,
        PolicyComponent,
        TermconditionComponent,
        CustFaqComponent,
        ButFaqComponent,
    ]
})
export class WeareModule { }
