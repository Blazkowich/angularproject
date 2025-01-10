import { JobService } from './../../../services/jobs.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CloseJobPopupComponent } from '../close-job-popup/close-job-popup.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Job } from '../../../models/jobs.model';

@Component({
  selector: 'commander-job-edit-popup',
  standalone: true,
  imports: [CommonModule, CloseJobPopupComponent, FormsModule],
  templateUrl: './job-edit-popup.component.html',
  styleUrls: ['./job-edit-popup.component.css']
})
export class JobEditPopupComponent implements OnInit {
  @ViewChild(CloseJobPopupComponent) closeJobPopup!: CloseJobPopupComponent;
  jobStatus: 'open' | 'closed' = 'open';
  isModalOpen = false;
  isCloseJobPopupOpen = false;
  currentJobId: string = '';
  jobSub: Subscription | undefined;
  job: Job | undefined;

  constructor(private route: ActivatedRoute, private jobService: JobService) {}

  ngOnInit(): void {
    this.currentJobId = this.route.snapshot.paramMap.get('id')!;
    if (this.currentJobId) {
      localStorage.setItem('jobId', this.currentJobId);
      this.jobSub = this.jobService.getJobById(this.currentJobId).subscribe({
        next: job => {
          this.job = job;
        }
      });
    } else {
      console.log('Job ID not found');
    }
  }

  openPopup() {
    this.isModalOpen = true;
  }

  closePopup() {
    this.isModalOpen = false;
  }

  updateJob() {
    console.log(`Updating job ${this.currentJobId} to status: ${this.jobStatus}`);
  }

  updateJobDetails() {
    console.log('Job details are being updated');
  }

  closeJob() {
    this.isModalOpen = false;
    this.isCloseJobPopupOpen = true;
  }

  closeCloseJobPopup() {
    this.isCloseJobPopupOpen = false;
  }
}
