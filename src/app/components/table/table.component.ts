import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Receipt, ReceiptService } from '../../services/receipt/receipt.service';
import { v4 as uuidv4 } from 'uuid';
import { CartService } from '../../services/cart/cart.service';

export interface TableStatus {
  tableNum: number;
  inUse: boolean;
  receiptId?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent   {
  numOfTables: number[] = Array.from({ length: 10 });
  @Output() tableStatusEmitter = new EventEmitter<TableStatus>();
  receipts!: Receipt[];
  @Input() tablesInUse!:any;
  tableNums!: (number | boolean)[];
  tableReceiptId: { tableNum: number, receiptId: string }[] = [];

  constructor(private receiptService: ReceiptService,
    private cartService:CartService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {  
    if (changes['tablesInUse'] && changes['tablesInUse'].currentValue) {
      this.tableNums = this.tablesInUse.map((receipt:any) => receipt.table);
      this.tableReceiptId = this.tablesInUse.map((receipt:any) => ({
            tableNum: receipt.table,
            receiptId: receipt.cartId 
          }));
      console.log(this.tableNums);      
      console.log(this.tableReceiptId);   
    }
  }  

  // updateTableData(data: any) {    
  //   this.receipts = data.data;
  //   console.log(this.receipts);
    
  //   this.tableNums = this.receipts.map((receipt:any) => receipt.table);
  //   this.tableReceiptId = this.receipts.map((receipt:any) => ({
  //     tableNum: receipt.table,
  //     receiptId: receipt.cartId || 'default-receipt-id'
  //   }));
  // }

  emitTableNum(tableNum: number | undefined): void {    
    if (tableNum) {
      var receiptId = this.getTableReceiptId(tableNum);
      if (this.compareTableNum(tableNum)) {
        const data: TableStatus = { tableNum, inUse: true, receiptId };
        this.tableStatusEmitter.emit(data);
      } else {
        const data: TableStatus = { tableNum, inUse: false };
        this.tableStatusEmitter.emit(data);
      }
    } else {
     
    }
  }

  compareTableNum(tableNum: number): boolean {
    return this.tableNums && this.tableNums.includes(tableNum);
  }

  private getTableReceiptId(tableNum: number): string | undefined {
    const table = this.tableReceiptId.find(entry => entry.tableNum === tableNum);
    return table?.receiptId;
  }


}
