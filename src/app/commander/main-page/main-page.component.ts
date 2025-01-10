import { CandidateService } from './../../services/candidates.service';
import { Component, OnInit } from '@angular/core';
import { Job } from '../../models/jobs.model';
import { JobService } from '../../services/jobs.service';
import { ImageComponent } from "../../shared/image/image.component";
import { ControlIconsComponent } from "../../shared/control-icons/control-icons.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Candidate } from '../../models/candidates.model';

@Component({
  selector: 'commander-main-page',
  standalone: true,
  imports: [
    ImageComponent,
    ControlIconsComponent,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  jobs: Job[] = [];
  candidates: Candidate[] = [];
  allCandidates: Candidate[] = [];
  currentFilter: 'preferred' | 'rejected' | 'pending' | 'all' = 'all';
  allCandidatesCount: number = 0;
  rejectedCandidatesCount: number = 0;
  preferredCandidatesCount: number = 0;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private router: Router) {}

  ngOnInit(): void {
    this.loadJobs();
    this.loadCandidates();
  }

  private loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs: Job[]) => {
        this.jobs = jobs.filter(job => this.isJobOpen(job));
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        alert('Failed to load jobs. Please try again later.');
      }
    });
  }

  private loadCandidates(): void {
    this.candidateService.getCandidates().subscribe({
      next: (candidates: Candidate[]) => {
        this.allCandidates = candidates;
        this.calculateTotalCounts();
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        alert('Failed to load candidates. Please try again later.');
      }
    });
  }

  private calculateTotalCounts(): void {
    // Count unique candidates across all jobs
    const uniqueCandidates = new Set(this.allCandidates.map(c => c.id));
    this.allCandidatesCount = uniqueCandidates.size;

    // Count candidates with 'rejected' status in any job
    const rejectedCandidates = new Set(
      this.allCandidates
        .filter(candidate =>
          Object.values(candidate.jobStatuses || {}).includes('rejected'))
        .map(c => c.id)
    );
    this.rejectedCandidatesCount = rejectedCandidates.size;

    // Count candidates with 'preferred' status in any job
    const preferredCandidates = new Set(
      this.allCandidates
        .filter(candidate =>
          Object.values(candidate.jobStatuses || {}).includes('preferred'))
        .map(c => c.id)
    );
    this.preferredCandidatesCount = preferredCandidates.size;
  }

  private applyFilter(): void {
    if (this.currentFilter === 'all') {
      this.candidates = this.allCandidates;
    } else {
      this.candidates = this.allCandidates.filter(candidate => {
        const filterStatus = this.currentFilter as 'preferred' | 'rejected' | 'pending';
        return Object.values(candidate.jobStatuses || {}).includes(filterStatus);
      });
    }
  }

  isJobOpen(job: Job): boolean {
    return job.status.toLowerCase() === 'open';
  }

  navigateToJob(jobId: string) {
    this.router.navigate(['/job-details', jobId]);
  }
}
