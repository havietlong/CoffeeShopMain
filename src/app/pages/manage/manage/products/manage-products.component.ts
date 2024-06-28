import { Component } from '@angular/core';
import { TableDisplayComponent } from '../../../../components/table-display/table-display.component';
import { ProductsService } from '../../../../services/products/products.service';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss',
  imports: [TableDisplayComponent,NzButtonModule]
})
export class ManageProductsComponent {
  columns: string[] = ['Name', 'Products in use']; // Update columns for employees
  data: any[] = [];
  
  

  constructor(private productService:ProductsService,private router:Router) {
    this.productService.getProducts().subscribe(products => {
      this.data = products;      
    });

  }

  addProducts(){
    this.router.navigate(['/manage/create/products']);
  }
}
