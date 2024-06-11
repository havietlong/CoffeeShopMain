import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  numOfTables: number[] = Array.from({length:10});
  @Output() tableNumEmitter = new EventEmitter<number>();

  emitTableNum(tableNum:number){
    this.tableNumEmitter.emit(tableNum);
  }
}
