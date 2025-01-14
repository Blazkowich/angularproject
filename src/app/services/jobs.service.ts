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

  getJobApplications(jobId: string): Observable<any[]> {
    const url = `${environment.baseUrl}/api/commander/jobs/${jobId}/applications`;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error(`Error fetching applications for job ${jobId}:`, error);
        return throwError(() => error);
      })
    );
  }

  addJob(job: Job): Observable<any> {
    const jobData = {
      name: job.jobName,
      description: job.jobDescription,
      positions: job.positions,
      category: job.jobCategory,
      unit: job.unit,
      address: job.address,
      openBase: job.openBase,
      additionalInfo: job.additionalInfo,
      questions: job.commonQuestions,
      answers: job.commonAnswers,
      workExperience: job.workExperience,
      education: job.education,
      passedCourses: job.passedCourses,
      techSkills: job.techSkills,
    };

    return this.http.post(`${environment.baseUrl}/api/commander/jobs`, jobData).pipe(
      catchError(error => {
        console.error('Error creating job:', error);
        return throwError(() => error);
      })
    );
  }
}
