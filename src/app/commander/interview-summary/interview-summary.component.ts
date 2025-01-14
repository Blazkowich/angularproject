import { CandidateMapperService } from './../../utils/candidate-mapper-commander';
import { CandidateService } from './../../services/candidates.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../models/candidates.model';
import { Subscription } from 'rxjs';
import { Route } from '@angular/router';
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

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private router: Router){}

  ngOnInit(): void {
    this.candidateId = this.route.snapshot.paramMap.get('id')!;
    this.jobId = localStorage.getItem('jobId')!;
    if (this.candidateId) {
      this.candidateSub = this.candidateService.getCommanderCandidateById(this.candidateId).subscribe({
        next: candidate => {
          this.candidate = CandidateMapperService.mapCandidateForProfile(candidate);
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

  onSave() {
    if (this.interviewNotes && this.interviewDate && this.automaticMessage && this.candidate) {
      const interview: Interview = {
        candidateId: this.candidate.id,
        jobId: this.jobId!,
        interviewNotes: this.interviewNotes,
        interviewDate: this.interviewDate,
        automaticMessage: this.automaticMessage,
        fullName: this.candidate.fullName,
        email: this.candidate.email
      };

      this.candidateService.saveInterviewSummary(interview).subscribe({
        next: response => {
          console.log('Interview saved successfully');
        },
        error: err => {
          console.log('Error saving interview:', err);
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
