import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerSignupComponent } from './customer-signup/customer-signup.component';
import { ButcherSignupComponent } from './butcher-signup/butcher-signup.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'login/:type', component: LoginComponent },
            { path: 'signup', component: CustomerSignupComponent },
            { path: 'butchersignup', component: ButcherSignupComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
