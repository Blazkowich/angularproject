import { CandidateMapperService } from './../../../utils/candidate-mapper-commander';
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
    this.router.navigate([`/job-details/${this.jobId}/candidates`]);
  }

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
  }
}
