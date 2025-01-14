import { Injectable } from '@angular/core';
import { Candidate } from '../models/candidates.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateMapperService {
  mapToCandidateModel(rawData: any, jobId?: string): Candidate {
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
    return rawDataArray.map(item => this.mapToCandidateModel(item, jobId));
  }
}
