import { Component, ViewChild } from '@angular/core';
import { ApplyVacancyPopupComponent } from '../../commander/popup-windows/apply-vacancy-popup/apply-vacancy-popup.component';

@Component({
  selector: 'app-job-application-details',
  standalone: true,
  imports: [ApplyVacancyPopupComponent],
  templateUrl: './job-application-details.component.html',
  styleUrl: './job-application-details.component.css'
})
export class JobApplicationDetailsComponent {
  @ViewChild(ApplyVacancyPopupComponent) popup!: ApplyVacancyPopupComponent;

  openPopup() {
    this.popup.show();
  }
}
