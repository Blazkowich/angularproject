import { CandidateService } from './../../services/candidates.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Candidate } from '../../models/candidates.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Job } from '../../models/jobs.model';
import { JobService } from '../../services/jobs.service';

@Component({
  selector: 'app-candidates-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidates-details.component.html',
  styleUrl: './candidates-details.component.css'
})
export class CandidatesDetailsComponent implements OnInit, OnDestroy{
  candidate: Candidate | undefined;
  job: Job | undefined;
  candidateSub: Subscription | undefined;
  jobSub: Subscription | undefined;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private location: Location) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const jobId = localStorage.getItem('jobId');
    if (id) {
      this.candidateSub = this.candidateService.getCandidateById(id).subscribe({
        next: candidate => {
          this.candidate = candidate;
        }
      });
    } else {
      console.log('Candidate ID not found');
    }

    if (jobId) {
      this.jobSub = this.jobService.getJobById(jobId).subscribe({
        next: job => {
          this.job = job;
        },
        error: err => {
          console.log('Error fetching job details:', err);
        }
      });
    } else {
      console.log('Job ID not found in localStorage');
    }
  }

  getCandidate(id: string): void {
    this.candidateService.getCandidateById(id).subscribe({
      next: candidate => this.candidate = candidate
    });
  }

  goBack() {
    this.location.back();
  }

  onAgree() {
    console.log("Agree");
  }

  onReject() {
    console.log("Reject");
  }

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
    if (this.jobSub) {
      this.jobSub.unsubscribe();
    }
  }
}
