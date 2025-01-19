import { CandidateMapperService } from '../../mappers/candidate-mapper-commander';
import { CandidateService } from './../../services/candidates.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../models/candidates.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Interview } from '../../models/interview.model';
import { Job } from '../../models/jobs.model';
import { JobService } from '../../services/jobs.service';
import { DateFormatterComponent } from '../../shared/date-formatter/date-formatter.component';
import { InterviewDateFormatterComponent } from '../../shared/date-formatter/interview-date-formatter.component';

@Component({
  selector: 'app-interview-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, InterviewDateFormatterComponent],
  templateUrl: './interview-summary.component.html',
  styleUrl: './interview-summary.component.css'
})
export class InterviewSummaryComponent implements OnInit, OnDestroy {
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

  currentUser: Candidate | undefined;
  currentJob: Job | undefined;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.candidateId = this.route.snapshot.paramMap.get('id')!;
    this.jobId = localStorage.getItem('jobId')!;
    this.loadCurrentJob(this.jobId);
    this.loadCurrentUser();
    this.loadInitialData();
  }

  private loadCurrentJob(currentJobId: string) {
    this.jobService.getJobById(currentJobId).subscribe({
      next: job => {
        if (job) {
          this.currentJob = job;
        }
      }
    });
  }

  private loadCurrentUser() {
    this.candidateService.getCurrentUser().subscribe({
      next: user => {
        if (user) {
          this.currentUser = CandidateMapperService.mapVolunteerCandidateModel(user);
        }
      }
    });
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
          this.interviewDate = interview.interviewDate ? new Date(interview.interviewDate) : null;
          this.automaticMessage = interview.automaticMessage || '';
          this.isInterviewScheduled = true;

          this.originalInterviewData = {
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

  onSave(): void {
    if (!this.candidateId || !this.jobId) {
        console.error('Missing required IDs');
        return;
    }

    if (!this.interviewDate) {
        console.error('Interview date and time must be selected');
        return;
    }

    const interviewEmailData = {
        candidate_email: this.candidate?.email || '',
        commander_email: this.currentUser?.email || '',
        job_title: this.currentJob?.jobName || '',
        interview_time: this.interviewDate,
        candidate_name: this.candidate?.fullName || '',
        commander_name: this.currentUser?.fullName || '',
        additional_info: this.automaticMessage || '',
    };

    console.log('Interview Email Data:', interviewEmailData);

    this.candidateService.sendInterviewData(interviewEmailData);
    this.getInterview(this.candidateId!, this.jobId!);
    window.location.reload();
}


  onCancel(): void {
    if (this.isInterviewScheduled) {
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
    this.router.navigate([`job-details/${this.jobId}/candidates`]);
  }

  onDateChange(formattedDate: string): void {
    console.log('Received formatted date:', formattedDate);

    const [datePart, timePart] = formattedDate.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');

    const months = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };

    this.interviewDate = new Date(
        parseInt(year),
        months[month as keyof typeof months],
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
    );

    console.log('Updated interview date:', this.interviewDate);
}

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
  }
}
