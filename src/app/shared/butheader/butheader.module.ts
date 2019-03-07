import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButheaderComponent } from './butheader.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        StarRatingModule.forRoot(),
    ],
    exports: [
        ButheaderComponent,
    ],
    declarations: [ButheaderComponent]
})
export class ButheaderModule { }
