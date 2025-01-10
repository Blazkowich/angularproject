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

  // Store preferred, rejected, and total counts for each job
  jobCandidatesCount: { [jobId: string]: { preferred: number; rejected: number; total: number } } = {};

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
        this.initializeJobCandidatesCount();
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
        this.calculateJobSpecificCounts();
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        alert('Failed to load candidates. Please try again later.');
      }
    });
  }

  private initializeJobCandidatesCount(): void {
    // Initialize job-specific counts for each job
    this.jobs.forEach(job => {
      this.jobCandidatesCount[job.id] = { preferred: 0, rejected: 0, total: 0 };
    });
  }

  private calculateJobSpecificCounts(): void {
    // Reset counts before recalculating
    this.jobs.forEach(job => {
      this.jobCandidatesCount[job.id].preferred = 0;
      this.jobCandidatesCount[job.id].rejected = 0;
      this.jobCandidatesCount[job.id].total = 0;
    });

    // Loop through candidates and update job-specific counts
    this.allCandidates.forEach(candidate => {
      Object.entries(candidate.jobStatuses || {}).forEach(([jobId, status]) => {
        if (this.jobCandidatesCount[jobId]) {
          // Increment the total count for the job
          this.jobCandidatesCount[jobId].total++;

          // Increment the counts for preferred and rejected statuses
          if (status === 'preferred') {
            this.jobCandidatesCount[jobId].preferred++;
          } else if (status === 'rejected') {
            this.jobCandidatesCount[jobId].rejected++;
          }
        }
      });
    });
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

  getPreferredAndRejectedCountForJob(jobId: string): string {
    const counts = this.jobCandidatesCount[jobId];
    return `${counts.preferred}/${counts.rejected}`;
  }

  getPreferredCountForJob(jobId: string): string {
    const counts = this.jobCandidatesCount[jobId];
    return `${counts.preferred}`;
  }

  getTotalCandidatesCountForJob(jobId: string): string {
    const counts = this.jobCandidatesCount[jobId];
    return `${counts.total}`;
  }
}
