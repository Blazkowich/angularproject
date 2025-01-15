import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-apply-vacancy-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-vacancy-popup.component.html',
  styleUrl: './apply-vacancy-popup.component.css'
})
export class ApplyVacancyPopupComponent {
  @Output() applied = new EventEmitter<{ additionalInfo: string, resume: File | null }>();
  isVisible = false;
  fileName = '';
  additionalInfo = '';
  resume: File | null = null;

  show() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
    this.reset();
  }

  reset() {
    this.fileName = '';
    this.additionalInfo = '';
    this.resume = null;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.resume = file;
      this.fileName = file.name;
    }
  }

  onSubmit() {
    this.applied.emit({ additionalInfo: this.additionalInfo, resume: this.resume });
    this.close();
  }
}
