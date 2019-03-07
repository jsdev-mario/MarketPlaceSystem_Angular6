import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderheaderComponent } from './orderheader.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
    ],
    exports: [
        OrderheaderComponent,
    ],
    declarations: [OrderheaderComponent]
})
export class OrderheaderModule { }
