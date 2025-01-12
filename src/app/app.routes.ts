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
import { UserMainPageComponent } from './user/user-main-page/user-main-page.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { JobApplicationDetailsComponent } from './user/job-application-details/job-application-details.component';
import { HrMainPageComponent } from './hr/hr-main-page/hr-main-page.component';
import { HrCandidatePageComponent } from './hr/hr-candidate-page/hr-candidate-page.component';
import { HrJobDetailsComponent } from './hr/hr-job-details/hr-job-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'open-jobs', component: MainPageComponent, canActivate: [MainGuard] },
  { path: 'create-job', component: CreateJobComponent, canActivate: [MainGuard] },
  { path: 'job-details/:id', component: JobDetailsComponent, canActivate: [MainGuard] },
  { path: 'closed-jobs', component: ClosedJobComponent, canActivate: [MainGuard] },
  { path: 'job-details/:id/candidates', component: CandidatesComponent, canActivate: [MainGuard] },
  { path: 'job-details/:id/candidates/preferred', component: CandidatesComponent, canActivate: [MainGuard] },
  { path: 'candidate-details/:id', component: CandidatesDetailsComponent, canActivate: [MainGuard] },
  { path: 'candidate-profile/:id', component: CandidateProfileComponent, canActivate: [MainGuard]},
  { path: 'interview-summary/:id', component: InterviewSummaryComponent, canActivate: [MainGuard]},
  { path: 'roles', component:UserMainPageComponent},
  { path: 'personal-profile', component: UserProfileComponent },
  { path: 'job-application-details/:id', component: JobApplicationDetailsComponent},
  { path: 'job-roles', component:HrMainPageComponent},
  { path: 'candidates-list', component:HrCandidatePageComponent },
  { path: 'job-roles/:id/candidate-list', component:HrCandidatePageComponent },
  { path: 'job-requirements/:id', component:HrJobDetailsComponent},

  { path: '**', redirectTo: '/login' }
];
