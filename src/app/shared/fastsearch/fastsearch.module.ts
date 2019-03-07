import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FastsearchComponent } from './fastsearch.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
    ],
    exports: [
        FastsearchComponent,
    ],
    declarations: [
        FastsearchComponent
    ]
})
export class FastsearchModule { }
