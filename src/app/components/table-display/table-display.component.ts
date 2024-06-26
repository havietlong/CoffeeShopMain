import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';
import { EmployeeService } from '../../services/employee/employee.service';

@Component({
  selector: 'app-table-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-display.component.html',
  styleUrl: './table-display.component.scss'
})
export class TableDisplayComponent implements OnChanges{
  @Output() notifyGetCatById: EventEmitter<number> = new EventEmitter<number>();
  @Input() columns: string[] = [];
  @Input() data: any = [];
  itemId!:number;
  
  currentPath: string = '';

  constructor(private activatedRoute: ActivatedRoute,private productsService:ProductsService, private employeeService:EmployeeService) {        
    // Subscribe to route changes to get the current path
    this.activatedRoute.url.subscribe(url => {
      this.currentPath = url.map(segment => segment.path).join('/');
    });
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
