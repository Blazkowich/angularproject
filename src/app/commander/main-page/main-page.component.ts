import { Component, OnInit } from '@angular/core';
import { Job } from '../../models/jobs.model';
import { JobService } from '../../services/jobs.service';
import { ImageComponent } from "../../shared/image/image.component";
import { ControlIconsComponent } from "../../shared/control-icons/control-icons.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'commander-main-page',
  standalone: true,
  imports: [
    ImageComponent,
    ControlIconsComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  jobs: Job[] = [];

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs: Job[]) => {
      this.jobs = jobs;
      console.log('Jobs fetched');
      },
      error: (error) => {
      console.error('Error fetching jobs', error);
      }
    });
  }
}
