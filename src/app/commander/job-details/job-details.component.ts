import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { JobEditPopupComponent } from '../popup-windows/job-edit-popup/job-edit-popup.component';
import { CloseJobPopupComponent } from "../popup-windows/close-job-popup/close-job-popup.component";
import { JobService } from '../../services/jobs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from '../../models/jobs.model';
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
  @ViewChild(JobEditPopupComponent) popup!: JobEditPopupComponent;
  @ViewChild(CloseJobPopupComponent) closePopup!: CloseJobPopupComponent;

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      localStorage.setItem('jobId', id);
      this.jobSub = this.jobService.getJobById(id).subscribe({
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
    this.location.back();
  }

  goToCandidates() {
    this.router.navigate(['/candidates']);
  }

  gotToPreferableCandidates() {
    this.router.navigate(['/candidates/preferred']);
  }

  ngOnDestroy(): void {
    if (this.jobSub) {
      this.jobSub.unsubscribe();
    }
  }
}
