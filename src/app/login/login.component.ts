import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  login(): void {
    if (this.username === this.fakeUser.username && this.password === this.fakeUser.password) {
      localStorage.setItem('authToken', 'fake-auth-token');
      console.log('Login successful');
      this.errorMessage = '';
      this.router.navigate(['/open-jobs']);
    } else {
      console.log('Login failed');
      this.errorMessage = 'Invalid username or password';
    }
  }

}
