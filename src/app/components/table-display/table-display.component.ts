import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductsService } from '../../services/products/products.service';
import { Employee, EmployeeService } from '../../services/employee/employee.service';
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
import { ReceiptService } from '../../services/receipt/receipt.service';
import { CategoriesService } from '../../services/categories/categories.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-table-display',
  standalone: true,
  templateUrl: './table-display.component.html',
  styleUrl: './table-display.component.scss',
  imports: [CommonModule, NzPaginationModule, NzModalModule, NzButtonModule, CreateProductsEditComponent, AddEmployeeEditComponent, NzInputModule, NzSelectModule, FormsModule, MiniorderComponent, SharedModule]
})
export class TableDisplayComponent implements OnChanges {
  @Output() notifyGetCatById: EventEmitter<number> = new EventEmitter<number>();
  @Input() columns: string[] = [];
  @Input() tablesInUse!:any;
  @Input() data: any = [];
  itemId!: number;
  isVisibleMiddle = false;

  columnsConfig!: any;

  currentPath: string = '';
  searchFilter: string = '';
  searchValue: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords!: number ;
  private token: string | null = null;

  constructor(private activatedRoute: ActivatedRoute, private productsService: ProductsService, private employeeService: EmployeeService, private searchService: SearchService, private http: HttpClient, private receiptsDetailService: ReceiptDetailService,private receiptService: ReceiptService,private categoriesService: CategoriesService) {
    // Subscribe to route changes to get the current path    
    
    
    this.activatedRoute.url.subscribe(url => {
      this.currentPath = url.map(segment => segment.path).join('/');
    });

    switch (this.currentPath) {
      case 'products':
        this.columnsConfig =
          [
            { key: 'productId', label: 'Mã sản phẩm', visible: false },
            { key: 'productName', label: 'Tên sản phẩm', visible: true },
            { key: 'productPrice', label: 'Giá sản phẩm', visible: true },
            { key: 'productDescription', label: 'Mô tả sản phẩm', visible: true },
            { key: 'categoryName', label: 'Danh mục sản phẩm', visible: true },
            // Add other columns as needed
          ];
        break;
      case 'employees':
        this.columnsConfig =
          [
            { key: 'username', label: 'Employee Name', visible: true },
            { key: 'userPosition', label: 'Employee Position', visible: true },
            { key: 'phoneNumber', label: 'Phonenumber', visible: true },
            { key: 'dateOfBirth', label: 'Date of birth', visible: true },
            // Add other columns as needed
          ];
        break;
      case 'categories':
        this.columnsConfig =
          [
            { key: 'categoryName', label: 'Tên danh mục', visible: true },
            // { key: 'userPosition', label: 'Employee Position', visible: true },
            // { key: 'phoneNumber', label: 'Phonenumber', visible: true },
            // { key: 'dateOfBirth', label: 'Date of birth', visible: true },
            // Add other columns as needed
          ];
        break;
      case 'receipts':
        this.columnsConfig =
          [
            { key: 'table', label: 'Bàn', visible: true },
            { key: 'receiptDate', label: 'Ngày', visible: true },
            { key: 'receiptTotal', label: 'Giá đơn', visible: true },            
            // { key: 'userPosition', label: 'Employee Position', visible: true },
            // { key: 'phoneNumber', label: 'Phonenumber', visible: true },
            // { key: 'dateOfBirth', label: 'Date of birth', visible: true },
            // Add other columns as needed
          ];
    }

   

    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }
    
    this.getTotalCount()
  }

  getTotalCount(){
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    let url = '';
  
    switch (this.currentPath) {
      case 'receipts':
        url = `http://localhost:5265/api/receipts`;
        this.http.get<any>(url, { headers }).subscribe((data: any) => {
      
          this.totalRecords = data.totalCount;
          console.log(this.totalRecords);
           // Assuming the response includes the total record count
        });
        break;
      case 'employees':
        url = `http://localhost:5265/api/Users`;
        this.http.get<any>(url, { headers }).subscribe((data: any) => {
      
          this.totalRecords = data.totalCount;
          console.log(this.totalRecords);
           // Assuming the response includes the total record count
        });
        break;
      case 'products':
        url = `http://localhost:5265/api/products`;
        this.http.get<any>(url, { headers }).subscribe((data: any) => {
      
          this.totalRecords = data.totalCount;
          console.log(this.totalRecords);
           // Assuming the response includes the total record count
        });
        break;
      case 'categories':
        url = `http://localhost:5265/api/category`;
        this.http.get<any>(url, { headers }).subscribe((data: any) => {
      
          this.totalRecords = data.totalCount;
          console.log(this.totalRecords);
           // Assuming the response includes the total record count
        });
        break;
    }
  
    
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchData(this.currentPage);
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
      ).subscribe((data: any) => {
        this.data = data.data;
      });
    } else {
      this.fetchData(this.currentPage);
    }
  }

  fetchData(page: number = 1): void {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    let url = '';
  
    switch (this.currentPath) {
      case 'receipts':
        url = `http://localhost:5265/api/receipts?page=${page}&sortBy=receiptDate`;
        break;
      case 'employees':
        url = `http://localhost:5265/api/Users?page=${page}`;
        break;
      case 'products':
        url = `http://localhost:5265/api/products?page=${page}`;
        break;
      case 'categories':
        url = `http://localhost:5265/api/category?page=${page}`;
        break;
    }
  
    this.http.get<any>(url, { headers }).subscribe((data: any) => {
      this.data = data.data;
      this.totalRecords = data.totalCount; // Assuming the response includes the total record count
    });
  }
  

  isVisible = false;
  receiptDetails!: any;
  receiptTotal!: number;
  receiptDate!: string;
  employeeData!: Employee;
  productData!: Product;
  showModal(receiptId?: string, receiptTotal?: number, receiptDate?: string, employeeId?: string, productId?: number): void {
    if (this.currentPath.includes('employees') && employeeId) {
      this.employeeService.getEmployeeById(employeeId).subscribe(
        res => {
          if (res) {
            this.employeeData = res;
            console.log("got it");

            this.isVisible = true;
          }
        }
      )
    } else if (this.currentPath.includes('products') && productId) {
      this.productsService.getProductById(productId).subscribe(
        res => {
          if (res) {
            this.productData = res.data;
            console.log("got data product");
            this.isVisible = true;
          }
        }
      )
    } else if (this.currentPath.includes('receipts') && receiptId ) {
      this.receiptsDetailService.getReceiptDetails(receiptId).subscribe(
        (res:any) => {
          if (res) {
            this.receiptDetails = res.data.receiptDetails;
            this.receiptTotal = res.data.receiptTotal;
            this.receiptDate = res.data.receiptDate;
            this.isVisible = true;
          }
        }
      );
    }

  }

  closeModal() {
    if (this.currentPath.includes('employees')) {
      this.employeeService.getEmployees().subscribe(
        res => {
          if (res) {

            this.data = res.data;
            this.isVisible = false;
          }
        }
      )
    } else if (this.currentPath.includes('products')) {
      this.productsService.getProducts().subscribe(
        (res: any) => {
          if (res) {

            this.data = res.data;
            this.isVisible = false;
          }
        }
      )
    }


  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  deleteItem(id: any) {
    if (this.currentPath.includes('employees')) {
      this.deleteEmployee(id);
    } else if (this.currentPath.includes('products')) {
      this.deleteProduct(id);
    }else if (this.currentPath.includes('categories')) {
      this.deleteCategories(id);
    }
  }

  deleteCategories(id: string): void {
    this.categoriesService.deleteCategory(id).subscribe(
      () => {
        this.fetchData();
      },
      (err) => {
        console.error('Error deleting employee:', err);
      }
    );
  }

  deleteEmployee(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe(
      () => {
        this.fetchData();
      },
      (err) => {
        console.error('Error deleting employee:', err);
      }
    );
  }

  deleteReceipt(id: string): void {
    this.receiptService.deleteReceipt(id).subscribe(
      () => {
        this.fetchData();
      },
      (err) => {
        console.error('Error deleting employee:', err);
      }
    );
  }


  deleteProduct(id: number): void {
    this.productsService.deleteProduct(id).subscribe(
      () => {
        this.fetchData();
      },
      (err) => {
        console.error('Error deleting product:', err);
      }
    );
  }

  ngOnChanges(): void {
    if (this.data && this.data.length > 0) {
      this.columns = Object.keys(this.data[0]).filter(key => key !== 'categoryId');
    }            
  }

  getCategoryById(id: number) {
    this.notifyGetCatById.emit(id);
  }

  isObject(value: Object) {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  getObjectKeys(obj: object): string[] {
    return Object.keys(obj);
  }
}
