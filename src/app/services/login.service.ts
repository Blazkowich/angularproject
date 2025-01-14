import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response?.access_token) {
            this.setAuthToken(response.access_token);
            this.setUserRole(response.role);
          }
        })
      );
  }

  private setAuthToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('authToken', token);
    }
  }

  private setUserRole(role: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('userRole', role);
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  isAuthenticated(): boolean {
    return this.isBrowser() ? !!localStorage.getItem('authToken') : false;
  }

  getAuthToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('authToken') : null;
  }

  getUserRole(): string | null {
    return this.isBrowser() ? localStorage.getItem('userRole') : null;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
    }
  }
}
