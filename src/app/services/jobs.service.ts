import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/jobs.model';


@Injectable({
  providedIn: 'root',
})
export class JobService {
  private jobsUrl = '/assets/jobs.json';

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<any[]>(this.jobsUrl);
  }
}
