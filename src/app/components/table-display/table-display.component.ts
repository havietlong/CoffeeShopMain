import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CreateProductsEditComponent } from '../../pages/manage/edit/products/create-products.component';
import { AddEmployeeEditComponent } from '../../pages/manage/edit/accounts/add-employee.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search/search.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MiniorderComponent } from "../miniorder/miniorder.component";
import { ReceiptDetail, ReceiptDetailService } from '../../services/receiptdetail/receiptdetail.service';
import { SharedModule } from "../../shared/shared.module";

@Component({
    selector: 'app-table-display',
    standalone: true,
    templateUrl: './table-display.component.html',
    styleUrl: './table-display.component.scss',
    imports: [CommonModule, NzModalModule, NzButtonModule, CreateProductsEditComponent, AddEmployeeEditComponent, NzInputModule, NzSelectModule, FormsModule, MiniorderComponent, SharedModule]
})
export class TableDisplayComponent implements OnChanges{
  @Output() notifyGetCatById: EventEmitter<number> = new EventEmitter<number>();
  @Input() columns: string[] = [];
  @Input() data: any = [];
  itemId!:number;
  isVisibleMiddle = false;
  
  currentPath: string = '';
  searchFilter: string = '';
  searchValue: string = '';
  
  private token: string | null = null;

  constructor(private activatedRoute: ActivatedRoute,private productsService:ProductsService, private employeeService:EmployeeService, private searchService:SearchService, private http:HttpClient, private receiptsDetailService:ReceiptDetailService) {        
    // Subscribe to route changes to get the current path
    this.activatedRoute.url.subscribe(url => {
      this.currentPath = url.map(segment => segment.path).join('/');
    });

    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }
  }

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  handleOkMiddle(): void {
    console.log('click ok');
    this.isVisibleMiddle = false;
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  onSearch(): void {
    if (this.searchFilter && this.searchValue) {
      console.log('working');
      
      this.searchService.searchRecords(
        this.currentPath,
        this.searchFilter,
        this.searchValue        
      ).subscribe(data => {
        this.data = data;
      });
    } else {
      this.fetchData();
    }
  }

  fetchData(): void {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    this.http.get<any[]>(`http://localhost:3000/${this.currentPath}`, { headers }).subscribe(data => {
      this.data = data;
    });
  }

  isVisible = false;
  receiptDetails!: ReceiptDetail[]
  receiptTotal!: number;
  receiptDate!: string;
  showModal(receiptId?:string,receiptTotal?:number,receiptDate?:string): void {    
    if (this.currentPath.includes('employees')) {
      
    } else if (this.currentPath.includes('products')) {
      
    }else if (this.currentPath.includes('receipts') && receiptId && receiptTotal && receiptDate) {
      
      
      this.receiptsDetailService.getReceiptDetails(receiptId).subscribe(
        res =>{
          if(res){
            this.receiptDetails = res;   
            this.receiptTotal = receiptTotal;
            this.receiptDate = receiptDate;        
          }
        }
      );
    }
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  deleteItem(id: any ) {
    if (this.currentPath.includes('employees')) {
      this.deleteEmployee(id);
    } else if (this.currentPath.includes('products')) {
      this.deleteProduct(id);
    }
  }

  deleteEmployee(id: string) {
    // Implement the logic to delete an employee
    this.employeeService.deleteEmployee(id).subscribe();
  }

  deleteProduct(id: number) {
    // Implement the logic to delete a product
    this.productsService.deleteProduct(id).subscribe();
  }


  ngOnChanges(): void {
    if (this.data && this.data.length > 0) {
      this.columns = Object.keys(this.data[0]);
    }
  }

  getCategoryById(id:number){
    this.notifyGetCatById.emit(id);
  }

  isObject(value: Object){
    return value && typeof value === 'object' && !Array.isArray(value);
  }
  

  getObjectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

}
