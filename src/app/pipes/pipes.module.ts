import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryOptionPipe } from './delivery-option.pipe';
import { CompanyLogoPipe } from './company-logo.pipe';
import { NumberFormatPipe } from './number-format.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        DeliveryOptionPipe,
        CompanyLogoPipe,
        NumberFormatPipe
    ],
    declarations: [
        DeliveryOptionPipe,
        CompanyLogoPipe,
        NumberFormatPipe
    ]
})
export class PipesModule {
    static forRoot() {
        return {
            ngModule: PipesModule,
            providers: [],
        };
    }
}
