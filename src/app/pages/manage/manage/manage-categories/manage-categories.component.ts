import { Component } from '@angular/core';
import { CategoriesService } from '../../../../services/categories/categories.service';
import { TableDisplayComponent } from "../../../../components/table-display/table-display.component";

@Component({
    selector: 'app-manage-categories',
    standalone: true,
    templateUrl: './manage-categories.component.html',
    styleUrl: './manage-categories.component.scss',
    imports: [TableDisplayComponent]
})
export class ManageCategoriesComponent {
  columns: string[] = ['Name', 'Products in use']; // Update columns for employees
  data: any[] = [];
  // categories: Category[] = [];
  

  constructor(private categoriesServices:CategoriesService) {
    this.categoriesServices.getCategories().subscribe(
      res => {
        if(res){
          this.data = res;
        }
      }
    );
  }

  createCategories(){
    
  }
}
