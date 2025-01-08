import { Component, ViewChild } from '@angular/core';
import { JobEditPopupComponent } from '../popup-windows/job-edit-popup/job-edit-popup.component';
import { CloseJobPopupComponent } from "../popup-windows/close-job-popup/close-job-popup.component";

@Component({
  selector: 'commander-job-details',
  standalone: true,
  imports: [JobEditPopupComponent],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent {
  @ViewChild(JobEditPopupComponent) popup!: JobEditPopupComponent;
  @ViewChild(CloseJobPopupComponent) closePopup!: CloseJobPopupComponent;

  openJobPopup() {
    this.popup.openPopup();
  }
}
