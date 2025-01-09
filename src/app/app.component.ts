import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateProfileComponent } from "./commander/candidate-profile/candidate-profile.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CandidateProfileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angularproject';
}
