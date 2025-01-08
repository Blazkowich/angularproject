import { Component, ViewChild } from '@angular/core';
import { JobEditPopupComponent } from '../job-edit-popup/job-edit-popup.component';

@Component({
  selector: 'commander-job-details',
  standalone: true,
  imports: [JobEditPopupComponent],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent {
  @ViewChild(JobEditPopupComponent) popup!: JobEditPopupComponent;

  openJobPopup() {
    this.popup.openPopup();
  }
}
