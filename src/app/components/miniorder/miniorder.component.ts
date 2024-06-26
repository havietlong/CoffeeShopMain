import { Component, Input, Output, SimpleChanges } from '@angular/core';
import { ReceiptDetail } from '../../services/receiptdetail/receiptdetail.service';
import { CommonModule } from '@angular/common';
import { Receipt, ReceiptService } from '../../services/receipt/receipt.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-miniorder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './miniorder.component.html',
  styleUrl: './miniorder.component.scss'
})
export class MiniorderComponent {
  @Input() tableNum!: number;
  @Input() receiptDetails: ReceiptDetail[] = [];
  @Input() receipt!: Receipt;
  @Output() payedReceiptEmitter = new EventEmitter<any>();

  constructor(private receiptService: ReceiptService) { }

  handlePayment() {
  if (this.receipt && this.receipt.ReceiptId) {
    this.receiptService.deleteReceipt(this.receipt.ReceiptId).subscribe({
      next: () => {
        this.payedReceiptEmitter.emit(true);
      },
      error: (err) => {
        // Handle error
        console.error('Error deleting receipt:', err);
      }
    });
  }
}
}
