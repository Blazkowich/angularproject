import { Injectable } from '@angular/core';
import { Candidate } from '../models/candidates.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateMapperService {
  static mapToCommanderCandidatesModel(rawData: any, jobId?: string): Candidate {
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

  static mapToCandidateModelArray(rawDataArray: any[], jobId?: string): Candidate[] {
    return rawDataArray.map(item => CandidateMapperService.mapToCommanderCandidatesModel(item, jobId));
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

  static mapVolunteerCandidateModel(response: any): Candidate {
    return {
      id: response.id?.toString() || '',
      fullName: response.full_name || '',
      idNumber: response.national_id || '',
      dateOfBirth: new Date(response.date_of_birth).toISOString() || '',
      age: response.age || null,
      gender: response.gender || '',
      profile: response.profile?.toString() || '',
      phone: response.phone,
      email: response.email || '',
      address: response.address || '',
      experience: response.experience || '',
      education: response.education || '',
      courses: response.courses || '',
      languages: response.languages || '',
      interests: response.interests || '',
      personalSummary: response.personal_summary || '',
      jobStatuses: {},
      imageUrl: ''
    };
  }

  static mapToUpdateVolunteerRequest(candidate: Candidate): any {
    return {
      id: candidate.id || null,
      full_name: candidate.fullName || null,
      address: candidate.address || null,
      primary_profession: candidate.profile || null,
      education: candidate.education || null,
      area_of_interest: candidate.interests || null,
      contact_reference: null,
      profile: candidate.profile || null,
      date_of_birth: new Date(candidate.dateOfBirth).toISOString(),
      gender: candidate.gender || null,
      experience: candidate.experience || null,
      courses: candidate.courses || null,
      languages: candidate.languages || null,
      personal_summary: candidate.personalSummary || null,
      phone: candidate.phone || null,
      email: candidate.email || null
    };
  }

  static mapFromUpdateVolunteerResponse(response: any, existingCandidate: Candidate): Candidate {
    if (!response) {
      throw new Error('Invalid response data');
    }

    return {
      id: response.id?.toString() || existingCandidate.id,
      fullName: response.full_name || existingCandidate.fullName,
      idNumber: existingCandidate.idNumber,
      dateOfBirth: new Date(response.date_of_birth).toISOString() || existingCandidate.dateOfBirth,
      age: response.age || existingCandidate.age,
      gender: response.gender || existingCandidate.gender,
      profile: response.profile || existingCandidate.profile,
      phone: response.phone || existingCandidate.phone,
      email: response.email || existingCandidate.email,
      address: response.address || existingCandidate.address,
      experience: response.experience || existingCandidate.experience,
      education: response.education || existingCandidate.education,
      courses: response.courses || existingCandidate.courses,
      languages: response.languages || existingCandidate.languages,
      interests: response.area_of_interest || existingCandidate.interests,
      personalSummary: response.personal_summary || existingCandidate.personalSummary,
      jobStatuses: existingCandidate.jobStatuses || {},
      imageUrl: response.imageUrl || existingCandidate.imageUrl
    };
  }

  static mapToCandidate(input: any): Candidate {
    return {
      id: input.id.toString(),
      fullName: input.full_name,
      idNumber: input.national_id,
      dateOfBirth: new Date(input.date_of_birth).toISOString(),
      age: input.age,
      gender: input.gender,
      profile: input.profile.toString(),
      phone: input.phone,
      email: input.email,
      address: input.address,
      experience: input.experience,
      education: input.education,
      courses: input.courses,
      languages: input.languages,
      interests: input.interests,
      personalSummary: input.personal_summary,
      jobStatuses: {},
      imageUrl: '',
    };
  }

}
