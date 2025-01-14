import { Injectable } from '@angular/core';
import { Candidate } from '../models/candidates.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateMapperService {
  static mapToCandidatesModel(rawData: any, jobId?: string): Candidate {
    const jobStatuses: { [key: string]: 'preferred' | 'rejected' | 'pending' } = {};

    if (jobId && rawData.status) {
      jobStatuses[jobId] = rawData.status as 'preferred' | 'rejected' | 'pending';
    }

    return {
      id: rawData.candidateUserId?.toString() || '',
      fullName: rawData.name || '',
      idNumber: '',
      dateOfBirth: '',
      age: rawData.age || 0,
      gender: '',
      profile: '',
      phone: '',
      email: '',
      address: '',
      experience: '',
      education: '',
      courses: '',
      languages: '',
      interests: '',
      personalSummary: '',
      jobStatuses: jobStatuses,
      imageUrl: ''
    };
  }

  mapToCandidateModelArray(rawDataArray: any[], jobId?: string): Candidate[] {
    return rawDataArray.map(item => CandidateMapperService.mapToCandidatesModel(item, jobId));
  }

  static mapCandidateForProfile(candidate: Candidate): any {
    return {
      id: candidate.id,
      fullName: candidate.fullName,
      idNumber: candidate.idNumber,
      dateOfBirth: candidate.dateOfBirth,
      age: candidate.age || null,
      gender: candidate.gender || null,
      profile: candidate.profile,
      phone: candidate.phone,
      email: candidate.email,
      address: candidate.address,
      experience: candidate.experience,
      education: candidate.education,
      courses: candidate.courses,
      languages: candidate.languages,
      interests: candidate.interests,
      personalSummary: candidate.personalSummary,
      jobStatuses: candidate.jobStatuses
        ? Object.entries(candidate.jobStatuses).reduce((acc, [jobId, status]) => {
            acc[jobId] = status;
            return acc;
          }, {} as { [jobId: string]: 'preferred' | 'rejected' | 'pending' })
        : {},
      imageUrl: candidate.imageUrl || null,
    };
  }
}
