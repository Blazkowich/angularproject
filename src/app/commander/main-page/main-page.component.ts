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
  currentFilter: 'preferred' | 'rejected' | 'neutral' | 'all' = 'all';
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
        this.allCandidatesCount = candidates.length;
        this.rejectedCandidatesCount = candidates.filter(candidate => candidate.status === 'rejected').length;
        this.preferredCandidatesCount = candidates.filter(candidate => candidate.status === 'preferred').length;
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        alert('Failed to load candidates. Please try again later.');
      }
    });
  }

  private applyFilter(): void {
    if (this.currentFilter === 'all') {
      this.candidates = this.allCandidates;
    } else {
      this.candidates = this.allCandidates.filter(candidate => candidate.status === this.currentFilter);
    }
  }

  isJobOpen(job: Job): boolean {
    return job.status.toLowerCase() === 'open';
  }

  navigateToJob(jobId: string) {
    this.router.navigate(['/job-details', jobId]);
  }
}
