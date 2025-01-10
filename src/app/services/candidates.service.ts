import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Candidate } from '../models/candidates.model';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private candidatesUrl = '/assets/data/candidates.json';

  constructor(private http: HttpClient) {}

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<any[]>(this.candidatesUrl);
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

  updateCandidateStatus(
    candidateId: string,
    jobId: string,
    status: 'preferred' | 'rejected' | 'pending'
  ): Observable<any> {
    return this.http.patch(`/api/candidates/${candidateId}/status`, {
      jobId,
      status
    });
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
