import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CompanyLogoPipe'
})
export class CompanyLogoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value || value === '') {
      return 'assets/images/company_logo.png';
    }
    return value;
  }

}
