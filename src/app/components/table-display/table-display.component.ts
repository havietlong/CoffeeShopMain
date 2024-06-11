import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
  selector: 'app-table-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-display.component.html',
  styleUrl: './table-display.component.scss'
})
export class TableDisplayComponent implements OnChanges{
  @Output() notifyGetCatById: EventEmitter<number> = new EventEmitter<number>();
  @Input() columns: string[] = [];
  @Input() data: any = [];
  

  ngOnChanges(): void {
    if (this.data && this.data.length > 0) {
      this.columns = Object.keys(this.data[0]);
    }
  }

  getCategoryById(id:number){
    this.notifyGetCatById.emit(id);
  }

  isObject(value: Object){
    return value && typeof value === 'object' && !Array.isArray(value);
  }
  

  getObjectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

}
