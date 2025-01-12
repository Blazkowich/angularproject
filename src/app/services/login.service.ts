import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Logs in the user and stores JWT token and role.
   * @param email User email
   * @param password User password
   */
  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/api/auth/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };

    return this.http.post<any>(url, body, { headers }).pipe(
      tap((response) => {
        // Store token and role in localStorage
        localStorage.setItem('authToken', response.access_token);
        localStorage.setItem('userRole', response.role);
      })
    );
  }

  /**
   * Logs out the user by clearing localStorage.
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  }

  /**
   * Retrieves the stored JWT token.
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Retrieves the stored user role.
   */
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
}
