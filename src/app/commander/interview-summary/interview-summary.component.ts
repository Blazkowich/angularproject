import { CandidateMapperService } from '../../mappers/candidate-mapper-commander';
import { CandidateService } from './../../services/candidates.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../models/candidates.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Interview } from '../../models/interview.model';

@Component({
  selector: 'app-interview-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview-summary.component.html',
  styleUrl: './interview-summary.component.css'
})
export class InterviewSummaryComponent implements OnInit, OnDestroy {
  interviewNotes: string = '';
  interviewDate: Date | null = null;
  automaticMessage: string = '';
  candidateSub: Subscription | undefined;
  candidate: Candidate | undefined;
  candidateId: string | undefined;
  jobId: string | undefined;
  interview: Interview | undefined;

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private router: Router){}

  ngOnInit(): void {
    this.candidateId = this.route.snapshot.paramMap.get('id')!;
    this.jobId = localStorage.getItem('jobId')!;
    this.getInterview(this.candidateId, this.jobId);
    if (this.candidateId) {
      this.candidateSub = this.candidateService.getCommanderCandidateById(this.candidateId).subscribe({
        next: candidate => {
          this.candidate = CandidateMapperService.mapCommanderCandidateForProfile(candidate);
        }
      });
    } else {
      console.log('Candidate ID not found');
    }
  }

  getCandidate(id: string): void {
    this.candidateService.getCandidateById(id).subscribe({
      next: candidate => this.candidate = candidate
    });
  }

  goBack() {
    this.router.navigate([`job-details/${this.jobId}/candidates/preferred`]);
  }

  getInterview(candidateId: string, jobId: string): void {
    this.candidateService.getInterview(jobId, candidateId).subscribe({
      next: interview => {
        if (interview) {
          this.interviewNotes = interview.interviewNotes || '';
          this.interviewDate = interview.interviewDate || null;
          this.automaticMessage = interview.automaticMessage || '';
          this.interview = interview;
        } else {
          console.log('No interview found for the given candidate and job');
        }
      },
      error: err => {
        console.error('Error fetching interview:', err);
      }
    });
  }

  onSave(): void {
    const interviewData: Interview = {
      candidateId: this.candidateId!,
      jobId: this.jobId!,
      interviewNotes: this.interviewNotes,
      interviewDate: this.interviewDate,
      automaticMessage: this.automaticMessage,
      status: this.interview ? this.interview.status : 'Pending',
      fullName: this.candidate?.fullName!,
      email: this.candidate?.email!,
    };

    if (this.interview) {
      this.candidateService.updateInterview(interviewData, this.jobId!, this.candidateId!).subscribe({
        next: updatedInterview => {
          console.log('Interview updated successfully', updatedInterview);
          this.router.navigate([`job-details/${this.jobId}/candidates/preferred`]);
        },
        error: err => {
          console.error('Error updating interview:', err);
        }
      });
    } else {
      this.candidateService.saveInterview(interviewData, this.jobId!, this.candidateId!).subscribe({
        next: newInterview => {
          console.log('New interview added successfully', newInterview);
          this.router.navigate([`job-details/${this.jobId}/candidates/preferred`]);
        },
        error: err => {
          console.error('Error adding new interview:', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
  }
}
