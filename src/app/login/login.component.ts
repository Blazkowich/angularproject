import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private loginService: LoginService) {}

  login(): void {
    this.loginService.login(this.username, this.password).subscribe(
      (response) => {
        localStorage.setItem('authToken', response.access_token);
        localStorage.setItem('role', response.role);
        console.log('Login successful');

        // Role-based redirection
        const userRole = response.role;
        if (userRole === 'volunteer') {
          this.router.navigate(['/roles']);
        } else if (userRole === 'commander') {
          this.router.navigate(['/open-jobs']);
        } else if (userRole === 'hr') {
          this.router.navigate(['/job-roles']);
        }
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}
