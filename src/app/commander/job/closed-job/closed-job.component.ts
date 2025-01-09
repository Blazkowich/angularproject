import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ControlIconsComponent } from '../../../shared/control-icons/control-icons.component';
import { Job } from '../../../models/jobs.model';
import { JobService } from '../../../services/jobs.service';

@Component({
  selector: 'app-closed-job',
  standalone: true,
  imports: [CommonModule, RouterModule, ControlIconsComponent],
  templateUrl: './closed-job.component.html',
  styleUrl: './closed-job.component.css'
})
export class ClosedJobComponent {
  jobs: Job[] = [];

  constructor(private jobService: JobService, private router: Router) {}

    ngOnInit(): void {
      this.loadJobs();
    }

    private loadJobs(): void {
      this.jobService.getJobs().subscribe({
        next: (jobs: Job[]) => {
          this.jobs = jobs.filter(job => this.isJobClosed(job));
        },
        error: (error) => {
          console.error('Error loading jobs:', error);
          alert('Failed to load jobs. Please try again later.');
        }
      });
    }

    navigateToJob(jobId: string) {
      this.router.navigate(['/job-details', jobId]);
    }

    isJobClosed(job: Job): boolean {
      return job.status.toLowerCase() === 'closed';
    }
}
