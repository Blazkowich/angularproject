import { LoginService } from './../../services/login.service';
import { CandidateMapperService } from './../../utils/candidate-mapper-commander';
import { CandidateService } from './../../services/candidates.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../models/candidates.model';
import { RouterModule } from '@angular/router';
import { BottomNavigationComponent } from "../../shared/bottom-navigation/bottom-navigation.component";
import { Router } from '@angular/router';
import { JobService } from '../../services/jobs.service';
import { Job } from '../../models/jobs.model';
import { JobMapper } from '../../utils/job-mapper';

@Component({
  selector: 'app-user-main-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BottomNavigationComponent],
  templateUrl: './user-main-page.component.html',
  styleUrl: './user-main-page.component.css'
})
export class UserMainPageComponent implements OnInit {
  searchQuery = '';
  candidate: Candidate | undefined;
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  isSortedAscending = true;

  constructor(
    private candidateService: CandidateService,
    private loginService: LoginService,
    private jobService: JobService,
    private router: Router) {}

  ngOnInit(): void {
    document.documentElement.style.setProperty('--background-color', 'white');
    this.candidateService.getCurrentUser().subscribe({
      next: (candidate: Candidate) => {
        this.candidate = CandidateMapperService.mapVolunteerCandidateModel(candidate);
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });

    this.jobService.getJobs().subscribe({
      next: (jobs: any[]) => {
        this.jobs = JobMapper.mapJobsForVolunteerMainPage(jobs);
        this.filteredJobs = [...this.jobs];
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

  filterJobs(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredJobs = this.jobs.filter((job) =>
      job.jobName.toLowerCase().includes(query)
    );
    this.sortJobs();
  }

  sortJobs(): void {
    this.filteredJobs.sort((a, b) => {
      const nameA = a.jobName.toLowerCase();
      const nameB = b.jobName.toLowerCase();

      if (nameA < nameB) {
        return this.isSortedAscending ? -1 : 1;
      }
      if (nameA > nameB) {
        return this.isSortedAscending ? 1 : -1;
      }
      return 0;
    });
  }

  toggleSortOrder(): void {
    this.isSortedAscending = !this.isSortedAscending;
    this.sortJobs();
  }
}
