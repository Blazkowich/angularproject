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

  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/api/auth/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };

    return this.http.post<any>(url, body, { headers }).pipe(
      tap((response) => {
        if (this.isLocalStorageAvailable()) {
          localStorage.setItem('authToken', response.access_token);
          localStorage.setItem('userRole', response.role);
        }
      })
    );
  }

  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
    }
  }

  getAuthToken(): string | null {
    return this.isLocalStorageAvailable() ? localStorage.getItem('authToken') : null;
  }

  getUserRole(): string | null {
    return this.isLocalStorageAvailable() ? localStorage.getItem('userRole') : null;
  }

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined';
    } catch (e) {
      return false;
    }
  }
}
