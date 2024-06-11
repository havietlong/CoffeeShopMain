import { Component } from '@angular/core';
import { TableDisplayComponent } from "../../../../components/table-display/table-display.component";
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../../services/employee/employee.service';
import { Category } from '../../../../services/categories/categories.service';

@Component({
  selector: 'app-manage-accounts',
  standalone: true,
  templateUrl: './manage-accounts.component.html',
  styleUrl: './manage-accounts.component.scss',
  imports: [TableDisplayComponent,RouterLink]
})
export class ManageAccountsComponent {
  columns: string[] = ['Name', 'Products in use']; // Update columns for employees
  data: any[] = [];
  categories: Category[] = [];
  

  constructor(private employeeService:EmployeeService, private router:Router) {
    this.employeeService.getEmployees().subscribe(employees => {
      this.data = employees;
    });

  }

  createEmployee(){
    this.router.navigate(['/manage/create/employees']);
  }
}
