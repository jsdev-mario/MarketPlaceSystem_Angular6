import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DeliveryOptionPipe'
})
export class DeliveryOptionPipe implements PipeTransform {

  transform(value: number): string {
    if (value > 0) {
      return 'Delivery: £ ' + value;
    } else {
      return 'Free delivery';
    }
  }
}
