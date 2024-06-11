import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account/account.service';
import { Router } from '@angular/router';

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
  
  constructor(private accountService: AccountService, private router:Router) {
    console.log(this.accountService.getAccounts());    
  }

  handleLogin() {
    this.accountService.login(this.username, this.password).subscribe(response => {
      localStorage.setItem('token',response.token);
      this.router.navigate(['/dashboard']);  // Redirect to the home page or dashboard
    }, error => {
      console.error('Login failed', error);
    });
  }
}



