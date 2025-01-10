import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { JobEditPopupComponent } from '../../../shared/popup-windows/job-edit-popup/job-edit-popup.component';
import { CloseJobPopupComponent } from "../../../shared/popup-windows/close-job-popup/close-job-popup.component";
import { JobService } from '../../../services/jobs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from '../../../models/jobs.model';
import { CommonModule, Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'commander-job-details',
  standalone: true,
  imports: [JobEditPopupComponent, CommonModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  job: Job | undefined;
  jobSub: Subscription | undefined;
  jobId: string = '';
  @ViewChild(JobEditPopupComponent) popup!: JobEditPopupComponent;
  @ViewChild(CloseJobPopupComponent) closePopup!: CloseJobPopupComponent;

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id')!;
    if (this.jobId) {
      localStorage.setItem('jobId', this.jobId);
      this.jobSub = this.jobService.getJobById(this.jobId).subscribe({
        next: job => {
          this.job = job;
        }
      });
    } else {
      console.log('Job ID not found');
    }
  }

  getJob(id: string): void {
    this.jobService.getJobById(id).subscribe({
      next: job => this.job = job
    });
  }

  isJobOpen(job: Job): boolean {
    return job && job.status.toLowerCase() === 'open';
  }

  openJobPopup() {
    this.popup.openPopup();
  }

  goBack() {
    this.router.navigate(['/open-jobs']);
  }

  goToCandidates() {
    this.router.navigate([`/job-details/${this.jobId}/candidates`]);
  }

  gotToPreferableCandidates() {
    this.router.navigate([`/job-details/${this.jobId}/candidates/preferred`]);
  }

  ngOnDestroy(): void {
    if (this.jobSub) {
      this.jobSub.unsubscribe();
    }
  }
}
