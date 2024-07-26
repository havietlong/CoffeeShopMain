import { Component, Input, Output, SimpleChanges, OnChanges, EventEmitter } from '@angular/core';
import { ReceiptDetail } from '../../services/receiptdetail/receiptdetail.service';
import { Receipt, ReceiptService } from '../../services/receipt/receipt.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';
import { TableStatus } from '../table/table.component';

@Component({
    selector: 'app-miniorder',
    standalone: true,
    templateUrl: './miniorder.component.html',
    styleUrls: ['./miniorder.component.scss'],
    imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule]
})
export class MiniorderComponent implements OnChanges {
  @Input() status!: TableStatus;
  @Input() productToPass!: any;
  @Input() tableStatus!:any;
  @Input() tableNum!: number;
  @Input() receiptDetails: ReceiptDetail[] = [];
  @Input() receipt!: Receipt;
  @Output() payedReceiptEmitter = new EventEmitter<any>();
  receiptTotal!: number;
  productDetails: any[] = [];
  customerName: string = '';
  customerPhone: string = '';
  customerBirthday: Date = new Date();
  userId = localStorage.getItem('id');

  receiptDate!: string;

  ngOnChanges(changes: SimpleChanges) {  
    if (changes['productToPass'] && changes['productToPass'].currentValue) {
      this.addProductToDetails(this.productToPass);
    }
  }  

  constructor(private receiptService: ReceiptService, private cartService: CartService) {
    this.receiptDate = String(new Date());
    console.log(this.receiptDate);
  }

  addProductToDetails(product: any) {
    const existingProduct = this.productDetails.find(detail => detail.ProductId === product.productId);
    
    if (existingProduct) {
      existingProduct.ProductQuantity += 1;
      existingProduct.ProductPrice = existingProduct.ProductQuantity * product.productPrice;
    } else {
      this.productDetails.push({
        ProductId: product.productId,
        ProductQuantity: 1,
        ProductPrice: product.productPrice,
        Product: product
      });
    }
    
    this.updateReceiptTotal();
  }

  updateReceiptTotal() {
    // Calculate the total price by summing up the cost of each product
    const newTotal = this.productDetails.reduce((total, detail) => {
      return total + (detail.ProductPrice);
    }, 0);
    
    this.receiptTotal = newTotal;
    console.log(this.receiptTotal);
  }

  deleteProduct(productId: string | undefined) {
    const index = this.productDetails.findIndex(detail => detail.ProductId === productId);
    if (index !== -1) {
      this.productDetails.splice(index, 1);
      this.updateReceiptTotal();
    }
  }

  addProduct(product: any, productQuantity: number) {
    if (product && product.productId) {
      const existingProduct = this.productDetails.find(detail => detail.ProductId === product.productId);
      
      if (existingProduct) {
        existingProduct.ProductQuantity += 1;
        existingProduct.ProductPrice = existingProduct.ProductQuantity * product.productPrice;
        this.updateReceiptTotal();
      }
    }
  }

  subtractProduct(product: any, productQuantity: number) {
    if (product && product.productId && productQuantity > 0) {
      const existingProduct = this.productDetails.find(detail => detail.ProductId === product.productId);
      
      if (existingProduct) {
        existingProduct.ProductQuantity -= 1;
        existingProduct.ProductPrice = existingProduct.ProductQuantity * product.productPrice;
        
        if (existingProduct.ProductQuantity <= 0) {
          this.deleteProduct(product.productId);
        } else {
          this.updateReceiptTotal();
        }
      }
    }
  }

  handlePayment() {
    if (this.productDetails.length > 0) {
      const receipt = {
        userId: this.userId,
        customerName: this.customerName,
        customerPhone: this.customerPhone,
        customerBirthday: this.customerBirthday,
        receiptDate: new Date(),
        table: this.tableNum,
        cartDetails: this.productDetails.filter(detail => detail.ProductQuantity > 0).map(detail => ({
          productId: detail.ProductId,
          productQuantity: detail.ProductQuantity
        }))
      };

      console.log(receipt);
      // Here you would replace the console.log with the actual API call
      this.cartService.addCart(receipt).subscribe({
        next: () => {
          this.payedReceiptEmitter.emit(true);
          this.productDetails=[];
        },
        error: (err) => {
          console.error('Error saving receipt details:', err);
        }
      });
    }
  }
}
