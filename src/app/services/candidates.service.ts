import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Candidate } from '../models/candidates.model';
import { environment } from '../../environments/environment';
import { CandidateMapperService } from '../mappers/candidate-mapper-commander';
import { Interview } from '../models/interview.model';
import { InterviewMapper } from '../mappers/interview-mapper';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private commanderCandidatesUrl = `${environment.baseUrl}/api/commander`;
  private volunteerUrl = `${environment.baseUrl}/api/volunteer`;
  private hrUrl = `${environment.baseUrl}/api/hr`;

  constructor(
    private http: HttpClient, private loginService: LoginService) {}


  getCurrentUser(): Observable<Candidate> {
    return new Observable(observer => {
      const cachedUser = this.loginService.getCurrentUser();

      if (!cachedUser) {
        observer.error(new Error('No volunteer data found'));
        return;
      }
      observer.next(cachedUser);
      observer.complete();
    });
  }

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<any[]>(this.commanderCandidatesUrl);
  }

  getCandidatesForHR(): Observable<Candidate[]> {
    return this.http.get<any[]>(`${this.hrUrl}/volunteers`);
  }

  getCandidateById(id: string): Observable<Candidate> {
    return this.getCandidates().pipe(
      map(candidates => {
        const candidate = candidates.find(candidate => candidate.id === id);
        if (!candidate) {
          throw new Error(`candidate with id ${id} not found`);
        }

        if (candidate.dateOfBirth) {
          candidate.age = this.calculateAge(candidate.dateOfBirth);
        }

        return candidate;
      })
    );
  }

  updateVolunteerProfile(candidate: Candidate): Observable<Candidate> {
    const userId = candidate.id;
    return this.http.patch<any>(`${this.volunteerUrl}/${userId}`, candidate)
      .pipe(
        map(response => {
          return CandidateMapperService.mapFromUpdateVolunteerResponse(response, candidate);
        }),
        catchError(error => {
          console.error('Error updating volunteer profile:', error);
          return throwError(() => new Error('Failed to update volunteer profile'));
        })
      );
  }

  /*
    Commander Field
  */

  getCandidatesForJob(id: string): Observable<Candidate[]> {
    return this.http.get<any[]>(`${this.commanderCandidatesUrl}/jobs/${id}/applications`).pipe(
      map(response => CandidateMapperService.mapCommandersCandidateModelArray(response, id))
    );
  }

  getCommanderCandidateById(id: string): Observable<Candidate> {
    const candidateUrl = `${this.commanderCandidatesUrl}/volunteers/${id}`;
    return this.http.get<Candidate>(candidateUrl).pipe(
      map(candidate => {
        if (!candidate) {
          throw new Error(`Candidate with ID ${id} not found`);
        }

        if (candidate.dateOfBirth) {
          candidate.age = this.calculateAge(candidate.dateOfBirth);
        }

        return candidate;
      }),
      catchError(error => {
        console.error(`Error fetching candidate with ID ${id}:`, error);
        return throwError(() => new Error('Unable to fetch candidate data'));
      })
    );
  }

  updateCandidateStatus(jobId: string, candidateId: string, status: 'preferred' | 'rejected'): Observable<any> {
    const url = `${this.commanderCandidatesUrl}/jobs/${jobId}/volunteers/${candidateId}`;
    return this.http.patch(url, { status }).pipe(
      catchError((error) => {
        console.error('Error updating candidate status:', error);
        return throwError(() => new Error('Unable to update candidate status'));
      })
    );
  }

  updateCandidate(candidate: Candidate): Observable<Candidate> {
    return this.http.put<Candidate>(`/api/candidates/${candidate.id}`, candidate);
  }

  getInterview(jobId: string, volunteerId: string): Observable<Interview> {
    const url = `${this.commanderCandidatesUrl}/jobs/${jobId}/volunteers/${volunteerId}/interviews`;
    return this.http.get<any>(url).pipe(
      map(response => InterviewMapper.mapToInterviewModel(response)),
      catchError(error => {
        console.error(`Error fetching interview for jobId ${jobId} and volunteerId ${volunteerId}:`, error);
        return throwError(() => new Error('Unable to fetch interview'));
      })
    );
  }

  saveInterview(interview: Interview, jobId: string, volunteerId: string): Observable<any> {
    const url = `${this.commanderCandidatesUrl}/jobs/${jobId}/volunteers/${volunteerId}/interviews`;
    return this.http.post(url, interview).pipe(
      catchError(error => {
        console.error('Error creating interview:', error);
        return throwError(() => new Error('Unable to create interview'));
      })
    );
  }

  updateInterview(interview: Interview, jobId: string, volunteerId: string): Observable<any> {
    const url = `${this.commanderCandidatesUrl}/jobs/${jobId}/volunteers/${volunteerId}/interviews`;
    return this.http.patch(url, interview).pipe(
      catchError(error => {
        console.error('Error updating interview:', error);
        return throwError(() => new Error('Unable to update interview'));
      })
    );
  }

  assignVolunteerToJob(volunteerId: string, jobId: string): Observable<any> {
    console.log('jobid',jobId, 'volId',volunteerId);
    const url = `${this.hrUrl}/assignments`;
    const payload = {
      volunteer_id: volunteerId,
      job_id: jobId
    };

    return this.http.post<any>(url, payload).pipe(
      map(response => {
        console.log(response.message)
        return {
          success: true,
          applicationId: response.application_id,
          message: response.message
        };
      }),
      catchError(error => {
        console.error('Error assigning volunteer:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to assign volunteer'));
      })
    );
  }

  private calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
