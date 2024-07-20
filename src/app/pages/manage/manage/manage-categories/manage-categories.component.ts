import { Component } from '@angular/core';
import { CategoriesService } from '../../../../services/categories/categories.service';
import { TableDisplayComponent } from "../../../../components/table-display/table-display.component";
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
    selector: 'app-manage-categories',
    standalone: true,
    templateUrl: './manage-categories.component.html',
    styleUrl: './manage-categories.component.scss',
    imports: [TableDisplayComponent,NzModalModule,FormsModule,NzInputModule]
})
export class ManageCategoriesComponent {
  columns: string[] = ['Name', 'Products in use']; // Update columns for employees
  data: any[] = [];
  isVisibleMiddle = false;
  value?: string;
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

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  handleOkMiddle(): void {
    // console.log(this.value);
    this.isVisibleMiddle = false;
   
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

}
