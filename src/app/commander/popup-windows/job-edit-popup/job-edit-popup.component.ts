import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { CloseJobPopupComponent } from '../close-job-popup/close-job-popup.component';

@Component({
  selector: 'commander-job-edit-popup',
  standalone: true,
  imports: [CommonModule, CloseJobPopupComponent],
  templateUrl: './job-edit-popup.component.html',
  styleUrls: ['./job-edit-popup.component.css']
})
export class JobEditPopupComponent {
  @ViewChild(CloseJobPopupComponent) closeJobPopup!: CloseJobPopupComponent;
  isModalOpen = false;
  isCloseJobPopupOpen = false;

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
    this.isModalOpen = false;
    this.isCloseJobPopupOpen = true;
  }

  closeCloseJobPopup() {
    this.isCloseJobPopupOpen = false;
  }
}
