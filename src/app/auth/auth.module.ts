import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule, FooterModule, ButheaderModule } from '../shared';
import { NgSelectModule } from '@ng-select/ng-select';
import { RecaptchaModule } from 'ng-recaptcha';
import { TabsModule } from 'ngx-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
    FacebookLoginProvider,
} from 'angular5-social-login';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { ButcherSignupComponent } from './butcher-signup/butcher-signup.component';
import { CustomerSignupComponent } from './customer-signup/customer-signup.component';
import { LoginComponent } from './login/login.component';

export function getAuthServiceConfigs() {
    const config = new AuthServiceConfig(
        [
            {
                id: FacebookLoginProvider.PROVIDER_ID,
                provider: new FacebookLoginProvider('229545117598659')
            },
        ]
    );
    return config;
}

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        HeaderModule,
        ButheaderModule,
        FooterModule,
        NgSelectModule,
        FormsModule,
        TabsModule.forRoot(),
        RecaptchaModule.forRoot(),
        TextMaskModule,
        SocialLoginModule
    ],
    providers: [
        {
        provide: AuthServiceConfig,
        useFactory: getAuthServiceConfigs
        }
    ],
    declarations: [
        AuthComponent,
        ButcherSignupComponent,
        CustomerSignupComponent,
        LoginComponent
    ]
})
export class AuthModule { }
