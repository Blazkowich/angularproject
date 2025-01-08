import { Routes } from '@angular/router';
import { CreateJobComponent } from './commander/create-job/create-job.component';
import { MainPageComponent } from './commander/main-page/main-page.component';
import { JobDetailsComponent } from './commander/job-details/job-details.component';
import { ClosedJobComponent } from './commander/closed-job/closed-job.component';

export const routes: Routes = [
  { path: '', redirectTo: '/open-jobs', pathMatch: 'full' },
  { path: 'open-jobs', component: MainPageComponent },
  { path: 'create-job', component: CreateJobComponent },
  { path: 'job-details/:id', component: JobDetailsComponent },
  { path: 'closed-jobs', component: ClosedJobComponent }
];
