import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'commander-job-edit-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-edit-popup.component.html',
  styleUrl: './job-edit-popup.component.css'
})
export class JobEditPopupComponent {
  isModalOpen = false;

  openPopup() {
    this.isModalOpen = true;
  }

  closePopup() {
    this.isModalOpen = false;
  }

  updateJob() {
    console.log('Job is being updated');
  }

  updateJobDetails() {
    console.log('Job details are being updated');
  }

  closeJob() {
    console.log('Job is being closed');
  }
}
