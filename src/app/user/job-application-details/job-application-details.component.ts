import { Component, ViewChild } from '@angular/core';
import { ApplyVacancyPopupComponent } from '../../shared/popup-windows/apply-vacancy-popup/apply-vacancy-popup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-application-details',
  standalone: true,
  imports: [ApplyVacancyPopupComponent, CommonModule],
  templateUrl: './job-application-details.component.html',
  styleUrl: './job-application-details.component.css'
})
export class JobApplicationDetailsComponent {
  @ViewChild(ApplyVacancyPopupComponent) popup!: ApplyVacancyPopupComponent;
  activeTab: 'jobRequirements' | 'faq' = 'jobRequirements';

  switchTab(tab: 'jobRequirements' | 'faq') {
    this.activeTab = tab;
  }

  openPopup() {
    this.popup.show();
  }
}
