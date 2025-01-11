import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserProfileComponent } from "./user/user-profile/user-profile.component";
import { UserMainPageComponent } from "./user/user-main-page/user-main-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, UserMainPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angularproject';
}
