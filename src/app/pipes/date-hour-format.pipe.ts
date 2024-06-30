import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dateHourFormat'
})
export class DateHourFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    const date = new Date(value);
    return formatDate(date, 'yyyy-MM-dd HH:mm', 'en-US');
  }
}
