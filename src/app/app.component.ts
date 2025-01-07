import { Component } from '@angular/core';
import { CreateJobComponent } from './commander/create-job/create-job.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CreateJobComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angularproject';
}
