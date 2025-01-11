import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Candidate } from '../../models/candidates.model';
import { Job } from '../../models/jobs.model';
import { CandidateService } from '../../services/candidates.service';
import { JobService } from '../../services/jobs.service';
import { HrBottomNavigationComponent } from '../../shared/hr-bottom-navigation/hr-bottom-navigation.component';

@Component({
  selector: 'app-hr-candidate-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HrBottomNavigationComponent],
  templateUrl: './hr-candidate-page.component.html',
  styleUrl: './hr-candidate-page.component.css'
})
export class HrCandidatePageComponent {
 searchQuery = '';
  candidate: Candidate | undefined;
  jobs: Job[] = [];

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService) {}

  ngOnInit(): void {
    document.documentElement.style.setProperty('--background-color', 'white');
    this.candidateService.getCandidateById("2").subscribe({
      next: (candidate: Candidate) => {
        this.candidate = candidate;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });

    this.jobService.getJobs().subscribe({
      next: (jobs: Job[]) => {
        this.jobs = jobs.filter(job => job.status.toLowerCase() !== 'closed');
      },
      error: (jobsError) => {
        console.error('Error loading jobs:', jobsError);
      }
    });
  }

  selectJob(jobId: string): void {
    localStorage.setItem('jobId', jobId);
  }
}
