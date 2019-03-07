import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {FooterModule} from '../shared/index';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    FooterModule,
  ],
  declarations: [
    HomeComponent,
  ]
})
export class HomeModule { }
