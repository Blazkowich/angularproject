import { Component } from '@angular/core';
import { MainPageComponent } from "./commander/main-page/main-page.component";
import { LoginComponent } from "./login/login.component";
import { CreateJobComponent } from './commander/create-job/create-job.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainPageComponent, LoginComponent, CreateJobComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angularproject';
}
