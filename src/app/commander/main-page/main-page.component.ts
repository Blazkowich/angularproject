import { Component, OnInit } from '@angular/core';
import { Job } from '../../models/jobs.model';
import { JobService } from '../../services/jobs.service';
import { ImageComponent } from "../../shared/image/image.component";
import { ControlIconsComponent } from "../../shared/control-icons/control-icons.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.loadJobs();
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

  isJobOpen(job: Job): boolean {
    return job.status.toLowerCase() === 'open';
  }

  navigateToJob(jobId: string) {
    this.router.navigate(['/job-details', jobId]);
  }
}
