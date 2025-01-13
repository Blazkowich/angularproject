import { LoginService } from './../../services/login.service';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'control-icons',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './control-icons.component.html',
  styleUrl: './control-icons.component.css'
})
export class ControlIconsComponent {

  constructor(private loginService: LoginService, private router: Router) {}

  Logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
