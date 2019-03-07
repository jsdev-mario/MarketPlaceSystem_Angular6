import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButcherComponent } from './butcher.component';
import { PipesModule } from '../../pipes/pipes.module';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        PipesModule,
        StarRatingModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        ButcherComponent
    ],
    declarations: [
        ButcherComponent
    ]
})
export class ButcherModule { }
