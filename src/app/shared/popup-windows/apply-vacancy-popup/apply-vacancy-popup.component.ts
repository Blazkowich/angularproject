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
  @Output() applied = new EventEmitter<boolean>();
  isVisible = false;
  fileName = '';
  additionalInfo = '';

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
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.fileName = file?.name || '';
  }

  onSubmit() {
    this.applied.emit(true);
    this.close();
  }
}
