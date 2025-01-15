import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../models/candidates.model';
import { Job } from '../../models/jobs.model';
import { CandidateService } from '../../services/candidates.service';
import { JobService } from '../../services/jobs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HrBottomNavigationComponent } from "../hr-bottom-navigation/hr-bottom-navigation.component";
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { JobMapper } from '../../utils/job-mapper';

@Component({
  selector: 'app-hr-main-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HrBottomNavigationComponent],
  templateUrl: './hr-main-page.component.html',
  styleUrl: './hr-main-page.component.css'
})
export class HrMainPageComponent implements OnInit {
  searchQuery = '';
  candidate: Candidate | undefined;
  jobs: Job[] = [];

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.documentElement.style.setProperty('--background-color', 'white');

    this.candidateService.getCurrentUser().subscribe({
      next: (candidate: Candidate) => {
        this.candidate = candidate;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });

    this.jobService.getJobs().subscribe({
      next: (jobs: Job[]) => {
        this.jobs = JobMapper.mapJobsForHRMainPage(jobs);
      },
      error: (jobsError) => {
        console.error('Error loading jobs:', jobsError);
      }
    });
  }

  selectJob(jobId: string): void {
    localStorage.setItem('jobId', jobId);
  }

  Logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}

