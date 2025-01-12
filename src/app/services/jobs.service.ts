import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, catchError, throwError } from 'rxjs';
import { Job } from '../models/jobs.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private jobsUrl = `${environment.baseUrl}/api/volunteer/jobs`;

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return throwError(() => new Error('Authorization token is missing'));
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accessToken}`);

    return this.http.get<Job[]>(this.jobsUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching jobs:', error);
        return throwError(() => error);
      })
    );
  }

  getJobById(id: string): Observable<Job> {
    return this.getJobs().pipe(
      map((jobs) => {
        const job = jobs.find((job) => job.id === id);
        if (!job) {
          throw new Error(`Job with id ${id} not found`);
        }
        return job;
      })
    );
  }
}
