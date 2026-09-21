import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncateText', standalone: true })
export class TruncateTextPipe implements PipeTransform {
  transform(value: string, limit = 50): string { return value; }
}
