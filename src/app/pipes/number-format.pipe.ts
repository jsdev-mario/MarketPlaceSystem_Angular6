import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

    transform(value: number): number {
        return Math.round(value * 100) / 100;
    }

    parse(value: string): string {
        return String(Math.round(Number(value) * 100) / 100);
    }
}
