import { Routes } from '@angular/router';
import { CreateJobComponent } from './commander/create-job/create-job.component';
import { MainPageComponent } from './commander/main-page/main-page.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'create-job', component: CreateJobComponent }
];
