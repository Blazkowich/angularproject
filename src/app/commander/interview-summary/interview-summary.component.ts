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
  isInterviewScheduled: boolean = false;
  showDeleteConfirmation: boolean = false;
  originalInterviewData: Partial<Interview> = {};

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.candidateId = this.route.snapshot.paramMap.get('id')!;
    this.jobId = localStorage.getItem('jobId')!;
    this.loadInitialData();
  }

  private loadInitialData(): void {
    if (!this.candidateId || !this.jobId) {
      console.error('Missing required IDs');
      return;
    }

    this.candidateSub = this.candidateService.getCommanderCandidateById(this.candidateId).subscribe({
      next: candidate => {
        this.candidate = CandidateMapperService.mapCommanderCandidateForProfile(candidate);
        this.getInterview(this.candidateId!, this.jobId!);
      },
      error: err => console.error('Error loading candidate:', err)
    });
  }

  getInterview(candidateId: string, jobId: string): void {
    this.candidateService.getInterview(jobId, candidateId).subscribe({
      next: interview => {
        if (interview) {
          this.interview = interview;
          this.interviewNotes = interview.interviewNotes || '';
          this.interviewDate = interview.interviewDate ? new Date(interview.interviewDate) : null;
          this.automaticMessage = interview.automaticMessage || '';
          this.isInterviewScheduled = true;

          this.originalInterviewData = {
            interviewNotes: this.interviewNotes,
            interviewDate: this.interviewDate,
            automaticMessage: this.automaticMessage
          };
        } else {
          this.isInterviewScheduled = false;
        }
      },
      error: err => {
        console.error('Unexpected error fetching interview:', err);
      }
    });
  }


  private hasChanges(): boolean {
    return this.interviewNotes !== this.originalInterviewData.interviewNotes ||
           this.interviewDate !== this.originalInterviewData.interviewDate ||
           this.automaticMessage !== this.originalInterviewData.automaticMessage;
  }

  private getChangedFields(): Interview {
    // Create a complete Interview object with all required fields
    return {
      candidateId: this.candidateId!,
      jobId: this.jobId!,
      interviewNotes: this.interviewNotes,
      interviewDate: this.interviewDate,
      automaticMessage: this.automaticMessage,
      status: this.interview?.status || 'Pending',
      fullName: this.candidate?.fullName || '',
      email: this.candidate?.email || '',
      // Include only the changed fields in the actual data sent to the server
      ...this.getChangedFieldsData()
    };
  }

  private getChangedFieldsData(): Partial<Interview> {
    const changes: Partial<Interview> = {};

    if (this.interviewNotes !== this.originalInterviewData.interviewNotes) {
      changes.interviewNotes = this.interviewNotes;
    }
    if (this.interviewDate !== this.originalInterviewData.interviewDate) {
      changes.interviewDate = this.interviewDate;
    }
    if (this.automaticMessage !== this.originalInterviewData.automaticMessage) {
      changes.automaticMessage = this.automaticMessage;
    }

    return changes;
  }

  onSave(): void {
    if (!this.candidateId || !this.jobId) {
      console.error('Missing required IDs');
      return;
    }

    const interviewData: Interview = {
      candidateId: this.candidateId,
      jobId: this.jobId,
      interviewNotes: this.interviewNotes,
      interviewDate: this.interviewDate,
      automaticMessage: this.automaticMessage,
      status: this.interview?.status || 'Pending',
      fullName: this.candidate?.fullName || '',
      email: this.candidate?.email || '',
    };

    if (this.isInterviewScheduled) {
      const updatedInterview = this.getChangedFields();
      if (Object.keys(this.getChangedFieldsData()).length > 0) {
        this.candidateService.updateInterview(updatedInterview, this.jobId, this.candidateId).subscribe({
          next: updatedInterview => {
            this.router.navigate([`job-details/${this.jobId}/candidates/preferred`]);
          },
          error: err => console.error('Error updating interview:', err)
        });
      }
    } else {
      this.candidateService.saveInterview(interviewData, this.jobId, this.candidateId).subscribe({
        next: newInterview => {
          this.router.navigate([`job-details/${this.jobId}/candidates/preferred`]);
        },
        error: err => console.error('Error adding new interview:', err)
      });
    }
  }

  onCancel(): void {
    if (this.isInterviewScheduled) {
      this.interviewNotes = this.originalInterviewData.interviewNotes || '';
      this.interviewDate = this.originalInterviewData.interviewDate || null;
      this.automaticMessage = this.originalInterviewData.automaticMessage || '';
    }
  }

  onDeleteClick(): void {
    this.showDeleteConfirmation = true;
  }

  onDeleteConfirm(): void {
    if (!this.candidateId || !this.jobId) {
      console.error('Missing required IDs');
      return;
    }

    this.candidateService.deleteInterview(this.jobId, this.candidateId).subscribe({
      next: () => {
        this.router.navigate([`job-details/${this.jobId}/candidates/preferred`]);
      },
      error: err => {
        console.error('Error deleting interview:', err);
        this.showDeleteConfirmation = false;
      }
    });
  }

  onDeleteCancel(): void {
    this.showDeleteConfirmation = false;
  }

  goBack(): void {
    this.router.navigate([`job-details/${this.jobId}/candidates/preferred`]);
  }

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
  }
}
