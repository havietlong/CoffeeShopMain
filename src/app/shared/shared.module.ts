import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateHourFormatPipe } from '../pipes/date-hour-format.pipe';

@NgModule({
  declarations: [DateHourFormatPipe],
  imports: [CommonModule],
  exports: [DateHourFormatPipe]
})
export class SharedModule {}
