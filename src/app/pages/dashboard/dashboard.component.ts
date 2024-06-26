import { Component, OnInit } from '@angular/core';
import { MiniorderComponent } from '../../components/miniorder/miniorder.component';
import { TableComponent, TableStatus } from '../../components/table/table.component';
import { ProductsSectionComponent } from "../../components/products-section/products-section.component";
import { Product, ProductsService } from '../../services/products/products.service';
import { CategoriesService, Category } from '../../services/categories/categories.service';
import { ProductImage, ProductImageService } from '../../services/productimages/productimages.service';
import { Receipt, ReceiptService } from '../../services/receipt/receipt.service';
import { CommonModule } from '@angular/common';
import { ReceiptDetail, ReceiptDetailService } from '../../services/receiptdetail/receiptdetail.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [MiniorderComponent, TableComponent, ProductsSectionComponent, CommonModule]
})
export class DashboardComponent implements OnInit {
  products!: Product[];
  receiptDetail!: ReceiptDetail[];
  receiptTotal!: number;
  receipts!: Receipt[];
  receipt!: Receipt;
  tableNum!: number;
  tableStatus!: TableStatus;
  categories!: Category[];
  images!: ProductImage[];


  constructor(private productService: ProductsService,
    private categoriesService: CategoriesService,
    private productImageService: ProductImageService,
    private receiptService: ReceiptService,
    private receiptDetailService: ReceiptDetailService
  ) {

  }

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
    this.categoriesService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
    this.productImageService.getProductImages().subscribe(
      (data: ProductImage[]) => {
        this.images = data;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
    this.receiptService.getReceipts().subscribe(
      (data: Receipt[]) => {
        this.receipts = data;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }



  selectTable(tableStatus: TableStatus) {
    // console.log(`table in use now: ${tableStatus.inUse}, id:${tableStatus.receiptId} `);
    console.log(tableStatus);

    this.tableNum = tableStatus.tableNum;
    this.tableStatus = tableStatus;
    this.updateReceipt(tableStatus.receiptId);
  }

  updateReceipt(receiptId: string | undefined) {
    if (receiptId) {
      this.receiptDetailService.getReceiptDetails(receiptId).subscribe(
        (data: ReceiptDetail[]) => {
          this.receiptDetail = data;
          this.receiptService.getReceiptById(receiptId).subscribe(
            (data: Receipt) => {
              this.receipt = data;
              this.tableNum = this.receipt.TableNum;
              this.tableStatus = { inUse: true, tableNum: this.receipt.TableNum, receiptId: receiptId }

            },
            (error) => {
              console.error('Error fetching receipt', error);
            }
          );
        },
        (error) => {
          if (error) {
            this.receiptDetail = [];
            this.receiptService.getReceiptById(receiptId).subscribe(
              (data: Receipt) => {
                this.receipt = data;
                this.tableNum = this.receipt.TableNum;
                this.tableStatus = { inUse: true, tableNum: this.receipt.TableNum, receiptId: receiptId }

              },
              (error) => {
                console.error('Error fetching receipt', error);
              }
            );
          }
        }
      );
    } else {
      this.receiptDetail = [];
    }
  }

  reloadReceipt(): void {  
      this.receiptService.getReceipts().subscribe(
        (data: Receipt[]) => {
          this.receipts = data;
          this.receiptDetail = [];
        },
        (error) => {
          console.error('Error fetching receipts', error);
        }
      );  
      
  }

  refreshReceipt(tableStatus: Partial<TableStatus>) {
    if (tableStatus.inUse) {
      this.receiptService.getReceipts().subscribe(
        (data: Receipt[]) => {
          console.log('here');
          this.receipts = data;
          this.updateReceipt(tableStatus.receiptId);
        },
        (error) => {
          console.error('Error fetching categories', error);
        }
      );
    }else{
      console.log('hello pickle');
      
    }
  }

  createFormTableNotUsed(tableNum: number): void {
    console.log(`tableNum now: ${tableNum}`);
    this.tableNum = tableNum;
    this.receiptDetail = [];
  }

}
