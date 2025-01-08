import { Component } from '@angular/core';
import { MainPageComponent } from "./commander/main-page/main-page.component";
import { CreateJobComponent } from "./commander/create-job/create-job.component";
import { LoginComponent } from "./login/login.component";
import { QuestionAnswerComponent } from "./question-answer/question-answer.component";
import { ControlIconsComponent } from "./shared/control-icons/control-icons.component";
import { ImageComponent } from "./shared/image/image.component";
import { JobDetailsComponent } from "./commander/job-details/job-details.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainPageComponent, CreateJobComponent, LoginComponent, QuestionAnswerComponent, ControlIconsComponent, ImageComponent, JobDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angularproject';
}
