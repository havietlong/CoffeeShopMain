import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../services/products/products.service';
import { Category } from '../../services/categories/categories.service';
import { ProductImage } from '../../services/productimages/productimages.service';
import { TableService } from '../../services/table/table.service';
import { Receipt, ReceiptService } from '../../services/receipt/receipt.service';
import { TableStatus } from '../table/table.component';
import { v4 as uuidv4 } from 'uuid';
import { ReceiptDetailService } from '../../services/receiptdetail/receiptdetail.service';
import { EventEmitter } from '@angular/core';
import { error } from 'console';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.scss'] // Fixed typo: styleUrl -> styleUrls
})
export class ProductsSectionComponent implements OnInit {
  @Input() tableNum!: number;
  @Input() status!: TableStatus;
  @Input() images!: ProductImage[];
  @Input() products!: Product[];
  @Input() categories!: Category[];
  @Output() addedReceiptDetailEmitter = new EventEmitter<Partial<TableStatus>>();
  tablesInUse!: number[];

  constructor(private tableService: TableService,
    private receiptService: ReceiptService,
    private receiptDetailService: ReceiptDetailService
  ) { } // Inject TableService

  ngOnInit(): void {
    this.tablesInUse = this.tableService.getTableNums(); // Retrieve table numbers in use from the service
  }

  handleAddProduct(productId: number | undefined, productPrice: number): void {
    if (this.status.inUse) {
      const data = {
        ProductId: productId,
        ProductPrice: productPrice,
        ProductQuantity: 1,
        ReceiptId: this.status.receiptId,
      }
      this.receiptDetailService.addReceiptDetail(data).subscribe(
        (res) => {
          if (res && res.ReceiptId) {
            this.updateReceiptPrice(res.ReceiptId).subscribe(
              (response) => {
                console.log('Receipt price updated successfully', response);
                const data: Partial<TableStatus> = {
                  inUse: true,
                  receiptId: this.status.receiptId
                }
                console.log(data);
                
                
                this.addedReceiptDetailEmitter.emit(data)
              },
              (error) => {
                console.error('Error updating receipt price', error);
              }
            );

           
          }
        },
        (error) => {
          console.error('Error adding receipt detail', error);
        }
      );


    } else {
      // Logic to handle the case where the table is not in use

      const data: Partial<Receipt> = {
        ReceiptId: this.generateUuid(),
        ReceiptDate: String(new Date()),
        EmployeeId: localStorage.getItem('id') || undefined,
        TableNum: this.status.tableNum,
      }
      this.receiptService.addReceipt(data).subscribe(
        (res) => {
          if (res) {
            const data = {
              ProductId: productId,
              ProductPrice: productPrice,
              ProductQuantity: 1,
              ReceiptId: res.ReceiptId,
            }
            console.log(data);

            this.receiptDetailService.addReceiptDetail(data).subscribe(
              (res) => {
                if (res && res.ReceiptId) {

                  this.updateReceiptPrice(res.ReceiptId).subscribe(
                    (response) => {
                      console.log('Receipt price updated successfully', response);
                      const data: Partial<TableStatus> = {
                        inUse: true,
                        receiptId: res.ReceiptId
                      }
                      console.log(data);
                      this.addedReceiptDetailEmitter.emit(data)
                    },
                    (error) => {
                      console.error('Error updating receipt price', error);
                    }
                  );


                 

                }
              },
              (error) => {
                console.error('Error adding receipt detail', error);
              }
            );
          }
        },
      )

    }
  }

  updateReceiptPrice(receiptId: string): Observable<any> {
    let totalProductPrice = 0;
    return this.receiptDetailService.getReceiptDetails(receiptId).pipe(
      switchMap((res) => {
        res.forEach((product) => {
          totalProductPrice += product.ProductPrice;
        });
        const data: Partial<Receipt> = {
          ReceiptTotal: totalProductPrice
        };
        return this.receiptService.updateReceipt(receiptId, data);
      })
    );
  }

  generateUuid(): string {
    return uuidv4();
  }

}
