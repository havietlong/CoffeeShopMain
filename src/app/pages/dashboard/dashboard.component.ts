import { Component, OnInit } from '@angular/core';
import { MiniorderComponent } from '../../components/miniorder/miniorder.component';
import { TableComponent } from '../../components/table/table.component';
import { ProductsSectionComponent } from "../../components/products-section/products-section.component";
import { Product, ProductsService } from '../../services/products/products.service';
import { CategoriesService, Category } from '../../services/categories/categories.service';
import { ProductImage, ProductImageService } from '../../services/productimages/productimages.service';
import { Receipt, ReceiptService } from '../../services/receipt/receipt.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [MiniorderComponent, TableComponent, ProductsSectionComponent,CommonModule]
})
export class DashboardComponent implements OnInit{
  products!: Product[];
  receipts!: Receipt[];
  tableNum!: number;
  categories!: Category[];
  images!: ProductImage[];


  constructor(private productService: ProductsService, 
    private categoriesService: CategoriesService,
    private productImageService: ProductImageService,
    private receiptService:ReceiptService,
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

  selectTable(tableNum:number){
    console.log(`Table clicked: ${tableNum + 1}`);
    this.tableNum = tableNum + 1;
  }

  // updateReceipt(){
    
  // }

}
