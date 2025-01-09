import { Routes } from '@angular/router';
import { CreateJobComponent } from './commander/job/create-job/create-job.component';
import { MainPageComponent } from './commander/main-page/main-page.component';
import { JobDetailsComponent } from './commander/job/job-details/job-details.component';
import { ClosedJobComponent } from './commander/job/closed-job/closed-job.component';
import { MainGuard } from './auth/main-guard/main-guard.component';
import { LoginComponent } from './login/login.component';
import { CandidatesComponent } from './commander/candidate/candidates/candidates.component';
import { CandidatesDetailsComponent } from './commander/candidate/candidates-details/candidates-details.component';
import { CandidateProfileComponent } from './commander/candidate/candidate-profile/candidate-profile.component';
import { InterviewSummaryComponent } from './commander/interview-summary/interview-summary.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'open-jobs', component: MainPageComponent, canActivate: [MainGuard] },
  { path: 'create-job', component: CreateJobComponent, canActivate: [MainGuard] },
  { path: 'job-details/:id', component: JobDetailsComponent, canActivate: [MainGuard] },
  { path: 'closed-jobs', component: ClosedJobComponent, canActivate: [MainGuard] },
  { path: 'candidates', component: CandidatesComponent, canActivate: [MainGuard] },
  { path: 'candidates/preferred', component: CandidatesComponent, canActivate: [MainGuard] },
  { path: 'candidate-details/:id', component: CandidatesDetailsComponent, canActivate: [MainGuard] },
  { path: 'candidate-profile/:id', component: CandidateProfileComponent, canActivate: [MainGuard]},
  { path: 'interview-summary/:id', component: InterviewSummaryComponent, canActivate: [MainGuard]},

  { path: '**', redirectTo: '/login' }
];
