import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Job } from '../models/jobs.model';


@Injectable({
  providedIn: 'root',
})
export class JobService {
  private jobsUrl = '/assets/data/jobs.json';

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<any[]>(this.jobsUrl);
  }

  getJobById(id: string): Observable<Job> {
    return this.getJobs().pipe(
      map(jobs => {
        const job = jobs.find(job => job.id === id);
        if (!job) {
          throw new Error(`Job with id ${id} not found`);
        }
        return job;
      })
    );
  }
}
