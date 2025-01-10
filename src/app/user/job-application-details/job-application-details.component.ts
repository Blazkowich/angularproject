import { Component, ViewChild } from '@angular/core';
import { ApplyVacancyPopupComponent } from '../../shared/popup-windows/apply-vacancy-popup/apply-vacancy-popup.component';
import { CancelVacancyPopupComponent } from '../../shared/popup-windows/cancel-vacancy-popup/cancel-vacancy-popup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-application-details',
  standalone: true,
  imports: [ApplyVacancyPopupComponent, CancelVacancyPopupComponent, CommonModule],
  templateUrl: './job-application-details.component.html',
  styleUrls: ['./job-application-details.component.css']
})
export class JobApplicationDetailsComponent {
  @ViewChild(ApplyVacancyPopupComponent) applyPopup!: ApplyVacancyPopupComponent;
  @ViewChild(CancelVacancyPopupComponent) cancelPopup!: CancelVacancyPopupComponent;

  activeTab: 'jobRequirements' | 'faq' = 'jobRequirements';
  isApplied = false;
  isCancelled = false;

  switchTab(tab: 'jobRequirements' | 'faq') {
    this.activeTab = tab;
  }

  toggleApplyCancel() {
    if (this.isApplied && !this.isCancelled) {
      this.cancelPopup.show();
    } else {
      this.applyPopup.show();
    }
  }

  onApply() {
    this.isApplied = true;
    this.isCancelled = false;
  }

  onCancel() {
    this.isApplied = false;
    this.isCancelled = false;
  }

  getButtonText(): string {
    if (this.isApplied) return 'Cancel';
    return 'Apply';
  }

  getButtonClass(): string {
    if (this.isApplied) return 'btn-danger';
    return 'btn-primary';
  }

  goBack() {

  }
}
