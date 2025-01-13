import { CandidateService } from './../../services/candidates.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../models/candidates.model';
import { RouterModule } from '@angular/router';
import { BottomNavigationComponent } from "../../shared/bottom-navigation/bottom-navigation.component";
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

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService) {}

  ngOnInit(): void {
    document.documentElement.style.setProperty('--background-color', 'white');
    this.candidateService.getCandidateById("1").subscribe({
      next: (candidate: Candidate) => {
        this.candidate = candidate;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });

    this.jobService.getJobs().subscribe({
      next: (jobs: any[]) => {
        this.jobs = jobs.map(job => JobMapper.mapJobResponse(job));
        //this.jobs = jobs.filter(job => job.status.toLowerCase() !== 'closed');
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
