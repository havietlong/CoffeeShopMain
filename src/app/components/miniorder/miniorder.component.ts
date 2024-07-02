import { Component, Input, Output, SimpleChanges } from '@angular/core';
import { ReceiptDetail, ReceiptDetailService } from '../../services/receiptdetail/receiptdetail.service';
import { CommonModule } from '@angular/common';
import { Receipt, ReceiptService } from '../../services/receipt/receipt.service';
import { EventEmitter } from '@angular/core';
import { ProductsService } from '../../services/products/products.service';
import { error } from 'console';
import { SharedModule } from "../../shared/shared.module";

@Component({
    selector: 'app-miniorder',
    standalone: true,
    templateUrl: './miniorder.component.html',
    styleUrl: './miniorder.component.scss',
    imports: [CommonModule, SharedModule]
})
export class MiniorderComponent {
  @Input() tableNum!: number;
  @Input() receiptDetails: ReceiptDetail[] = [];
  @Input() receipt!: Receipt;
  @Output() payedReceiptEmitter = new EventEmitter<any>();

  constructor(private receiptService: ReceiptService, private receiptDetailService: ReceiptDetailService, private productService: ProductsService) { }

  updateReceiptTotal() {
    const newTotal = this.receiptDetails.reduce((total, detail) => total + detail.ProductPrice, 0);
    this.receipt.ReceiptTotal = newTotal;
    this.receiptService.updateReceipt(this.receipt.ReceiptId!, { ReceiptTotal: newTotal }).subscribe();
  }

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

  deleteProduct(productId: number | undefined) {
    const receiptId = this.receipt.ReceiptId;
    if (receiptId) {
      this.receiptDetailService.deleteReceiptDetail(receiptId, productId).subscribe(
        res => {         
          const index = this.receiptDetails.findIndex(detail => detail.ProductId === productId);
          if (index !== -1) {
            this.receiptDetails.splice(index, 1);
            this.updateReceiptTotal();
          }
        }        
      );
    }
  }

  addProduct(productId: number | undefined, productQuantity: number) {
    if (productId) {
      this.productService.getProductById(productId).subscribe(
        res => {
          if (res) {
            const productPriceforOne = res.ProductPrice;
            const newProductQuantity = productQuantity + 1;
            const receiptId = this.receipt.ReceiptId;
            const data: Partial<ReceiptDetail> = {
              ProductQuantity: newProductQuantity,
              ProductPrice: productPriceforOne * newProductQuantity
            }
            this.receiptDetailService.updateReceiptDetail(receiptId, productId, data).subscribe(
              updatedReceiptDetail => {
                const index = this.receiptDetails.findIndex(detail => detail.ProductId === productId);
                if (index !== -1) {
                  const updatedDetail: ReceiptDetail = {
                    ...this.receiptDetails[index],
                    ...data
                  };
                  this.receiptDetails[index] = updatedDetail;
                  this.updateReceiptTotal();
                }
              }
            );
          }
        },

      )
    }
  }

  subtractProduct(productId: number | undefined, productQuantity: number) {
    if (productId && productQuantity > 0) {
      this.productService.getProductById(productId).subscribe(
        res => {
          if (res) {
            const productPriceforOne = res.ProductPrice;
            const newProductQuantity = productQuantity - 1;
            const receiptId = this.receipt.ReceiptId;
            const data: Partial<ReceiptDetail> = {
              ProductQuantity: newProductQuantity,
              ProductPrice: productPriceforOne * newProductQuantity
            };
            this.receiptDetailService.updateReceiptDetail(receiptId, productId, data).subscribe(
              updatedReceiptDetail => {
                const index = this.receiptDetails.findIndex(detail => detail.ProductId === productId);
                if (index !== -1) {
                  // Ensure the Product property is retained
                  const updatedDetail: ReceiptDetail = {
                    ...this.receiptDetails[index],
                    ...data
                  };
                  this.receiptDetails[index] = updatedDetail;
                  this.updateReceiptTotal();
                }
              }
            );
          }
        }
      );
    }
  }
}