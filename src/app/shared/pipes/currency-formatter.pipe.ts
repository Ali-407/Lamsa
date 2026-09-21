import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyFormatter', standalone: true })
export class CurrencyFormatterPipe implements PipeTransform {
  transform(value: number): string { return ''; }
}
