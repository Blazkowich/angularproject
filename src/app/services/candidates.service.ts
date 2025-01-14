import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Candidate } from '../models/candidates.model';
import { environment } from '../../environments/environment';
import { CandidateMapperService } from '../utils/candidate-mapper-commander';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private candidatesUrl = `${environment.baseUrl}/api/commander`;

  constructor(private http: HttpClient, private candidateMapperService: CandidateMapperService) {}

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<any[]>(this.candidatesUrl);
  }

  getCandidatesForJob(id: string): Observable<Candidate[]> {
    return this.http.get<any[]>(`${this.candidatesUrl}/jobs/${id}/applications`).pipe(
      map(response => this.candidateMapperService.mapToCandidateModelArray(response, id))
    );
  }

  getCommanderCandidateById(id: string): Observable<Candidate> {
    const candidateUrl = `${this.candidatesUrl}/volunteers/${id}`;
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

  updateCandidateStatus(jobId: string, candidateId: string, status: 'preferred' | 'rejected'): Observable<any> {
    const url = `${this.candidatesUrl}/jobs/${jobId}/volunteers/${candidateId}`;
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
