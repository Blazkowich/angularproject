import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateProfileComponent } from "./commander/candidate/candidate-profile/candidate-profile.component";
import { InterviewSummaryComponent } from "./commander/interview-summary/interview-summary.component";
import { UserMainPageComponent } from "./user/user-main-page/user-main-page.component";
import { JobApplicationDetailsComponent } from "./user/job-application-details/job-application-details.component";
import { UserProfileComponent } from "./user/user-profile/user-profile.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CandidateProfileComponent, InterviewSummaryComponent, UserMainPageComponent, JobApplicationDetailsComponent, UserProfileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angularproject';
}
