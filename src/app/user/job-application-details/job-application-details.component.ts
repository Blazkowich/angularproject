import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApplyVacancyPopupComponent } from '../../shared/popup-windows/apply-vacancy-popup/apply-vacancy-popup.component';
import { CancelVacancyPopupComponent } from '../../shared/popup-windows/cancel-vacancy-popup/cancel-vacancy-popup.component';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/jobs.service';
import { Router } from '@angular/router';
import { Job } from '../../models/jobs.model';

@Component({
  selector: 'app-job-application-details',
  standalone: true,
  imports: [ApplyVacancyPopupComponent, CancelVacancyPopupComponent, CommonModule],
  templateUrl: './job-application-details.component.html',
  styleUrls: ['./job-application-details.component.css']
})
export class JobApplicationDetailsComponent implements OnInit {
  @ViewChild(ApplyVacancyPopupComponent) applyPopup!: ApplyVacancyPopupComponent;
  @ViewChild(CancelVacancyPopupComponent) cancelPopup!: CancelVacancyPopupComponent;

  activeTab: 'jobRequirements' | 'faq' = 'jobRequirements';
  isApplied = false;
  isCancelled = false;
  job: Job | undefined;
  jobId: string = '';

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    document.documentElement.style.setProperty('--background-color', '#282949');

    this.jobId = localStorage.getItem('jobId')!;
    if (this.jobId) {
      this.jobService.getJobById(this.jobId).subscribe({
        next: (job: Job) => {
          this.job = job;
        },
        error: (err) => {
          console.error('Error fetching job details:', err);
        }
      });
    } else {
      console.error('No jobId found in localStorage.');
    }
  }

  switchTab(tab: 'jobRequirements' | 'faq') {
    this.activeTab = tab;
  }

  toggleApplyCancel() {
    if (this.isApplied && !this.isCancelled) {
      this.cancelPopup.show();
    } else {
      this.applyPopup.show();
    }
  }

  onApply() {
    this.isApplied = true;
    this.isCancelled = false;
  }

  onCancel() {
    this.isApplied = false;
    this.isCancelled = false;
  }

  getButtonText(): string {
    if (this.isApplied) return 'Cancel';
    return 'Apply';
  }

  getButtonClass(): string {
    if (this.isApplied) return 'btn-danger';
    return 'btn-primary';
  }

  goBack() {
    this.router.navigate(['/roles']);
  }
}
