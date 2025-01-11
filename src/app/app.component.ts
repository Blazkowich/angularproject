import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserMainPageComponent } from "./user/user-main-page/user-main-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angularproject';
}
