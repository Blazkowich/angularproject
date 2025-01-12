import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Candidate } from '../../models/candidates.model';
import { Job } from '../../models/jobs.model';
import { CandidateService } from '../../services/candidates.service';
import { JobService } from '../../services/jobs.service';
import { HrBottomNavigationComponent } from '../../shared/hr-bottom-navigation/hr-bottom-navigation.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ApplyCandidatePopupComponent } from '../../shared/popup-windows/apply-candidate-popup/apply-candidate-popup.component';
import { AddNewCandidatePopupComponent } from '../../shared/popup-windows/add-new-candidate-popup/add-new-candidate-popup.component';

@Component({
  selector: 'app-hr-candidate-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HrBottomNavigationComponent,
    ApplyCandidatePopupComponent,
    AddNewCandidatePopupComponent
  ],
  templateUrl: './hr-candidate-page.component.html',
  styleUrl: './hr-candidate-page.component.css'
})
export class HrCandidatePageComponent implements OnInit, OnDestroy {
  searchQuery = '';
  currentCandidate: Candidate | undefined;
  jobs: Job[] = [];
  candidates: Candidate[] = [];
  jobId: string | undefined;
  isJobSpecificList = false;
  isModalOpen = false;
  isAddCandidateModalOpen = false;
  selectedJobName: string | undefined;
  selectedJobUnit: string | undefined;
  private routerSubscription: Subscription;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private router: Router
  ) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = this.router.url;
      this.isJobSpecificList = /\/job-roles\/\d+\/candidate-list$/.test(currentUrl);

      if (this.isJobSpecificList) {
        const matches = currentUrl.match(/\/job-roles\/(\d+)\/candidate-list/);
        this.jobId = matches ? matches[1] : undefined;
      }
    });
  }

  ngOnInit(): void {
    document.documentElement.style.setProperty('--background-color', 'white');

    this.candidateService.getCandidates().subscribe({
      next: (candidates: Candidate[]) => {
        this.candidates = candidates;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });

    this.candidateService.getCandidateById("2").subscribe({
      next: (candidate: Candidate) => {
        this.currentCandidate = candidate;
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

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getStatusButton(candidate: Candidate): { text: string; class: string } {
    if (!this.isJobSpecificList || !this.jobId) {
      return { text: '', class: '' };
    }

    const status = candidate.jobStatuses?.[this.jobId]?.toLowerCase();

    switch (status) {
      case 'pending':
        return {
          text: 'Pending',
          class: 'btn btn-outline-warning status-button'
        };
      case 'rejected':
        return {
          text: 'Rejected',
          class: 'btn btn-outline-danger status-button'
        };
      case 'preferred':
        return {
          text: 'Assigned',
          class: 'btn btn-outline-success status-button'
        };
      default:
        return {
          text: 'Job Placement',
          class: 'btn btn-outline-primary status-button'
        };
    }
  }

  selectJob(jobId: string): void {
    this.jobService.getJobById(jobId).subscribe({
      next: (job: Job) => {
        this.selectedJobName = job.jobName;
        this.selectedJobUnit = job.unit;
        this.isModalOpen = true;
      },
      error: (err) => {
        console.error('Error fetching job details:', err);
      }
    });
  }


  selectCandidate(candidateId: string): void {
    localStorage.setItem('candidateId', candidateId);
  }

  openAddCandidatePopup(): void {
    this.isAddCandidateModalOpen = true;
  }

  closeAddCandidatePopup(): void {
    this.isAddCandidateModalOpen = false;
    this.loadCandidates();
  }

  private loadCandidates(): void {
    this.candidateService.getCandidates().subscribe({
      next: (candidates: Candidate[]) => {
        this.candidates = candidates;
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
      }
    });
  }

  closePopup(): void {
    this.isModalOpen = false;
  }
}
