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
      // this.router.navigate(['/dashboard']);  // Redirect to the home page or dashboard
    this.accountService.login(this.username, this.password).subscribe((response:any) => {
      console.log(response);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      // localStorage.setItem('id', response.userId);
      this.getEmployeeId(response.data.user.userId);
      this.router.navigate(['/dashboard']);  // Redirect to the home page or dashboard
    }, error => {
      console.error('Login failed', error);
    });
  }

  getEmployeeId(userId:string) {
    localStorage.setItem('id', userId);
  }
}



