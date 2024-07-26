import { Component, Input, OnInit } from '@angular/core';
import { MiniorderComponent } from '../../components/miniorder/miniorder.component';
import { TableComponent, TableStatus } from '../../components/table/table.component';
import { ProductsSectionComponent } from "../../components/products-section/products-section.component";
import { Product, ProductsService } from '../../services/products/products.service';
import { CategoriesService, Category } from '../../services/categories/categories.service';
import { ProductImage, ProductImageService } from '../../services/productimages/productimages.service';
import { Receipt, ReceiptService } from '../../services/receipt/receipt.service';
import { CommonModule } from '@angular/common';
import { ReceiptDetail, ReceiptDetailService } from '../../services/receiptdetail/receiptdetail.service';
import { SharedModule } from '../../shared/shared.module';
import EventEmitter from 'events';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CartService } from '../../services/cart/cart.service';
import { error } from 'console';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [MiniorderComponent, TableComponent, ProductsSectionComponent, CommonModule, SharedModule,NzModalModule]
})
export class DashboardComponent implements OnInit {  
  products!: any;
  receiptDetail!: ReceiptDetail[];
  receiptTotal!: number;
  receipts!: any;
  receipt!: Receipt;
  tableNum!: number;
  tableStatus!: TableStatus;
  categories!: Category[];
  images!: ProductImage[];
  cartDetailData!:any;
  userId = localStorage.getItem('id');

  constructor(private productService: ProductsService,
    private categoriesService: CategoriesService,
    private productImageService: ProductImageService,
    private receiptService: ReceiptService,
    private receiptDetailService: ReceiptDetailService,
    private cartService: CartService
  ) {

  }

  isVisibleMiddle = false;

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  handleOkMiddle(): void {
    if(this.cartDetailData){
      console.log("cartData",this.cartDetailData);
      
      const receipt = {
        userId: this.userId,
        customerName: this.cartDetailData.customerName,
        customerPhone: this.cartDetailData.customerName,
        customerBirthday: this.cartDetailData.customerBirthday,
        receiptDate: this.cartDetailData.cartTime,
        table: this.tableNum,
        receiptDetailDTOs:this.cartDetailData.cartDetails
      };      
      this.receiptService.addReceipt(receipt).subscribe(
        (res)=>{
          if(res){
            this.cartService.getCart().subscribe(
              res => {
                if (res){
                  this.receipts = res.data;
                }
              }              
            )       
          }
        }
      )
    }
    this.isVisibleMiddle = false;

  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (data: any) => {
        if (data) {
          this.products = data.data;
          console.log("products got data");
        }
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
    this.categoriesService.getCategories().subscribe(
      (data:any) => {
        this.categories = data.data;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
    // this.productImageService.getProductImages().subscribe(
    //   (data: ProductImage[]) => {
    //     this.images = data;
    //   },
    //   (error) => {
    //     console.error('Error fetching categories', error);
    //   }
    // );
    this.cartService.getCart().subscribe(
      (data: any) => {
        this.receipts = data.data;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }



  selectTable(tableStatus: TableStatus) {
    console.log("click");
    
    // console.log(`table in use now: ${tableStatus.inUse}, id:${tableStatus.receiptId} `);    
    this.tableNum = tableStatus.tableNum;
    this.tableStatus = tableStatus;
    console.log(tableStatus);



    if(this.tableStatus.inUse == true && tableStatus.receiptId){
      // this.cartService.getCartById()           
      this.isVisibleMiddle=true;      
      this.cartService.getCartById(tableStatus.receiptId).subscribe(
        res => {
          if(res){                       
            this.cartDetailData = res.data;
            console.log(res.data);            
          }
        },
        error =>{
          console.error(error)
        }
      ) 
    }
  }

 
  

  reloadReceipt(): void {
    this.cartService.getCart().subscribe(
      (data: any) => {
        this.receipts = data.data;
        this.receiptDetail = [];
      },
      (error) => {
        console.error('Error fetching receipts', error);
      }
    );

  }

  createFormTableNotUsed(tableNum: number): void {
    console.log(`tableNum now: ${tableNum}`);
    this.tableNum = tableNum;
    this.receiptDetail = [];

  }

  productToPass!:any;

  passToMiniOrder(data:any){
    this.productToPass = data;
    console.log(this.productToPass);
    
  }

}
