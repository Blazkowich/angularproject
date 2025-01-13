import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, catchError, throwError } from 'rxjs';
import { Job } from '../models/jobs.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private role = localStorage.getItem('userRole');
  private jobsUrl =
  this.role === 'volunteer' ? `${environment.baseUrl}/api/volunteer/jobs` :
  this.role === 'commander' ? `${environment.baseUrl}/api/commander/jobs` :
  this.role === 'hr' ? `${environment.baseUrl}/api/hr/jobs` :
  (() => { throw new Error('Invalid role'); })();

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.jobsUrl).pipe(
      catchError(error => {
        console.error('Error fetching jobs:', error);
        return throwError(() => error);
      })
    );
  }

  getJobById(id: string): Observable<Job> {
    return this.getJobs().pipe(
      map(jobs => {
        const job = jobs.find(j => j.id === id);
        if (!job) {
          throw new Error(`Job with id ${id} not found`);
        }
        return job;
      })
    );
  }
}
