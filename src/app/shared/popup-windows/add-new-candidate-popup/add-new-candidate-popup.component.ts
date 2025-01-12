import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-new-candidate-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-new-candidate-popup.component.html',
  styleUrls: ['./add-new-candidate-popup.component.css'],
})
export class AddNewCandidatePopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  soldierName: string = '';
  soldierId: string = '';
  message: string | null = null;

  addSoldier(event: Event) {
    event.preventDefault();
    if (this.soldierName && this.soldierId) {
      this.message = 'The soldier was successfully added. Will be displayed in the candidate database';
    }
  }

  close() {
    this.closePopup.emit();
  }
}
