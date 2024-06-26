import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account/account.service';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee/employee.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username!: string;
  password!: string;

  constructor(private accountService: AccountService,
    private employeeService: EmployeeService,
    
    private router: Router) {

      
  }

  handleLogin() {
    this.accountService.login(this.username, this.password).subscribe(response => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('id', response.userId);
      this.getEmployeeId();
      this.router.navigate(['/dashboard']);  // Redirect to the home page or dashboard
    }, error => {
      console.error('Login failed', error);
    });
  }

  getEmployeeId() {
    const accountId = localStorage.getItem('id')
    this.employeeService.getEmployees().subscribe(
      res => {
        if (res) {
          res.forEach((item: { AccountId: string | null; EmployeeId: string; }) => {
            if (item.AccountId === accountId) {
              localStorage.removeItem('id');
              localStorage.setItem('id', item.EmployeeId);
            }
          });
        }
      }
    )
  }
}



