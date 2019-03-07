import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { OrderModule } from './order/order.module';
import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WeareModule } from './weare/weare.module';
import { TokenCheck } from './guard';


const routes: Routes = [
    { path: '', loadChildren: './home/home.module#HomeModule', canActivate: [TokenCheck]},
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule', canActivate: [TokenCheck]},
    { path: 'user', loadChildren: './user/user.module#UserModule', canActivate: [TokenCheck]},
    { path: 'order', loadChildren: './order/order.module#OrderModule', canActivate: [TokenCheck]},
    { path: 'weare', loadChildren: './weare/weare.module#WeareModule'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
