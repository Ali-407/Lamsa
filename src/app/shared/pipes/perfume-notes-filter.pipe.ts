import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'perfumeNotesFilter', standalone: true })
export class PerfumeNotesFilterPipe implements PipeTransform {
  transform(value: any[]): any[] { return value; }
}
