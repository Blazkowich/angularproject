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

  private readonly fakeUser = {
    username: 'user',
    password: 'user'
  };

  constructor(private router: Router, private loginService: LoginService) {}

 /**
   * Handles the login process.
   */
  login(): void {
    this.loginService.login(this.username, this.password).subscribe({
      next: () => {
        console.log('Login successful');
        this.errorMessage = '';
        this.router.navigate(['/open-jobs']);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = 'Invalid username or password';
      },
    });
  }
}
