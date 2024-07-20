import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { Product, ProductsService } from '../../../services/products/products.service';
import { CategoriesService, Category } from '../../../services/categories/categories.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NzLayoutModule,CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  tableNum!:number;
  products!:Product[];
  categories!:Category[];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private productsService:ProductsService,
    private categoriesService:CategoriesService
  ) {
    this.route.params.subscribe(params => {
      const number = params['id']; 
      this.tableNum = number;
      if (number > 10) {
        this.router.navigate(['/not-found']); // Navigate to the 404 page
      }
    });
  }

  ngOnInit(){
    this.productsService.getProducts().subscribe(
      res => {
        if(res){
          this.products = res;
        }
      }
    );
    this.categoriesService.getCategories().subscribe(
      res => {
        if(res){
          this.categories = res;
        }
      }
    )
  }
}
