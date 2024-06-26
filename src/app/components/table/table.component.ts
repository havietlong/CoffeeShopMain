import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Receipt, ReceiptService } from '../../services/receipt/receipt.service';
import { v4 as uuidv4 } from 'uuid';

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
export class TableComponent implements OnInit {
  numOfTables: number[] = Array.from({ length: 10 });
  @Output() tableStatusEmitter = new EventEmitter<TableStatus>();
  receipts!: Receipt[];
  tableNums!: (number | boolean)[];
  tableReceiptId: { tableNum: number, receiptId: string }[] = [];

  constructor(private receiptService: ReceiptService) {}

  ngOnInit(): void {
    this.initiateTableData();
    this.subscribeToReceiptUpdates();
  }

  initiateTableData() {
    this.receiptService.getReceipts().subscribe(
      (data: Receipt[]) => {
        this.updateTableData(data);
      },
      (error) => {
        console.error('Error fetching receipts', error);
      }
    );
  }

  subscribeToReceiptUpdates() {
    this.receiptService.getReceiptUpdates().subscribe(
      (data: Receipt[]) => {
        this.updateTableData(data);
      },
      (error) => {
        console.error('Error receiving receipt updates', error);
      }
    );
  }

  updateTableData(data: Receipt[]) {
    this.receipts = data;
    this.tableNums = this.receipts.map(receipt => receipt.TableNum);
    this.tableReceiptId = this.receipts.map(receipt => ({
      tableNum: receipt.TableNum,
      receiptId: receipt.ReceiptId || 'default-receipt-id'
    }));
  }

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
      const data: Partial<Receipt> = {
        ReceiptId: this.generateUuid(),
        ReceiptDate: String(new Date()),
      };
      this.receiptService.addReceipt(data).subscribe(() => {
        // Handle any post-addition logic here
      });
      this.tableStatusEmitter.emit();
    }
  }

  compareTableNum(tableNum: number): boolean {
    return this.tableNums && this.tableNums.includes(tableNum);
  }

  private getTableReceiptId(tableNum: number): string | undefined {
    const table = this.tableReceiptId.find(entry => entry.tableNum === tableNum);
    return table?.receiptId;
  }

  generateUuid(): string {
    return uuidv4();
  }
}
