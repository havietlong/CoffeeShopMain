import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { SearchService } from '../../services/search/search.service';
import { FormsModule } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.scss'] // Fixed typo: styleUrl -> styleUrls
})
export class ProductsSectionComponent implements OnInit {
  @Input() tableNum!: number;
  @Input() images!: ProductImage[];
  @Input() products!: any;
  @Input() categories!: any;
  @Output() pushReceiptDetailProductEmitter = new EventEmitter<any>();
  @Output() addedReceiptDetailEmitter = new EventEmitter<Partial<TableStatus>>();
  tablesInUse!: number[];
  productsName!: string;

  constructor(private tableService: TableService,
    private receiptService: ReceiptService,
    private receiptDetailService: ReceiptDetailService,
    private searchService: SearchService,
    private notification: NzNotificationService
  ) { } // Inject TableService

  ngOnInit(): void {
    this.tablesInUse = this.tableService.getTableNums(); // Retrieve table numbers in use from the service        
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categories'] && changes['categories'].currentValue) {
      console.log(this.categories);
    }

    if (changes['products'] && changes['products'].currentValue) {
      console.log(this.products);
    }
  }

  search(CategoryId?: string) {
    if (!CategoryId) {
      this.searchService.searchRecords('products', 'ProductName', this.productsName).subscribe(
        (res: any) => {
          if (res) {
            this.products = res.data;
          }
        }
      );
    } else if (CategoryId) {
      this.searchService.searchRecords('products', 'CategoryId', CategoryId).subscribe(
        (res: any) => {
          if (res) {
            this.products = res.data;
          }
        }
      );
    }
  }

  handleAddProduct(productId: number | undefined, productName: string, productPrice: number): void {

    if (this.tableNum) {

      const productToAdd = {
        productId: productId,
        productName: productName,
        productPrice: productPrice
      }

      console.log(productToAdd);
      this.pushReceiptDetailProductEmitter.emit(productToAdd);
      console.log("here two");
    } else {
      this.createBasicNotification();
    }

  }

  createBasicNotification(): void {
    this.notification
      .error(
        'Hãy chọn bàn trước',
        '',
        {nzStyle: {
          fontWeight:'bold',
          width: '600px',
          marginLeft: '-265px',
          backgroundColor: 'rgb(247, 183, 183)'
        },}
      )
      .onClick.subscribe(() => {
        console.log('notification clicked!');
      });
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
