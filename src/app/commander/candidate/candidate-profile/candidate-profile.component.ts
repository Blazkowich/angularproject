import { CandidateMapperService } from '../../../mappers/candidate-mapper-commander';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Candidate } from '../../../models/candidates.model';
import { CandidateService } from '../../../services/candidates.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.css'
})
export class CandidateProfileComponent implements OnInit, OnDestroy {
  candidate: Candidate | undefined;
  candidateSub: Subscription | undefined;
  jobId: string | undefined;

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private router: Router)
  {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.jobId = localStorage.getItem('jobId')!;
    if (id) {
      this.candidateSub = this.candidateService.getCommanderCandidateById(id).subscribe({
        next: candidate => {
          this.candidate = CandidateMapperService.mapCommanderCandidateForProfile(candidate);
        }
      });
    } else {
      console.log('Candidate ID not found');
    }
  }

  downloadPdf(): void {
    if (!this.jobId || !this.candidate?.id) {
      console.error('Job ID or Candidate ID is missing');
      return;
    }

    this.candidateService.downloadResume(this.jobId, this.candidate.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `Resume_${this.candidate?.fullName}.pdf`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Failed to download resume:', err),
    });
  }

  getCandidate(id: string): void {
    this.candidateService.getCandidateById(id).subscribe({
      next: candidate => this.candidate = candidate
    });
  }

  goBack() {
    this.router.navigate([`/job-details/${this.jobId}/candidates`]);
  }

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
  }
}
