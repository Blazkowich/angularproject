import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Job } from '../../../models/jobs.model';

@Component({
  selector: 'app-update-job-popup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-job-popup.component.html',
  styleUrls: ['./update-job-popup.component.css']
})
export class UpdateJobPopupComponent {
  @Input() job!: Job;
  @Input() isModalOpen: boolean = false;
  @Output() closePopupEvent = new EventEmitter<void>();
  @Output() jobUpdated = new EventEmitter<Job>();

  onSubmit() {
    this.jobUpdated.emit(this.job);
    this.closePopupEvent.emit();
  }

  close() {
    this.closePopupEvent.emit();
  }

  addQAPair() {
    if (this.job) {
      this.job.commonQuestions.push('');
      this.job.commonAnswers.push('');
    }
  }

  removeQAPair(index: number) {
    if (this.job) {
      this.job.commonQuestions.splice(index, 1);
      this.job.commonAnswers.splice(index, 1);
    }
  }
}
