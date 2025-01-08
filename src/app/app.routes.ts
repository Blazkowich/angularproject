import { Routes } from '@angular/router';
import { CreateJobComponent } from './commander/create-job/create-job.component';
import { MainPageComponent } from './commander/main-page/main-page.component';
import { JobDetailsComponent } from './commander/job-details/job-details.component';
import { ClosedJobComponent } from './commander/closed-job/closed-job.component';
import { MainGuard } from './auth/main-guard/main-guard.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'open-jobs', component: MainPageComponent, canActivate: [MainGuard] },
  { path: 'create-job', component: CreateJobComponent, canActivate: [MainGuard] },
  { path: 'job-details/:id', component: JobDetailsComponent, canActivate: [MainGuard] },
  { path: 'closed-jobs', component: ClosedJobComponent, canActivate: [MainGuard] },
  { path: '**', redirectTo: '/login' }
];
