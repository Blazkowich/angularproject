import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-apply-candidate-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apply-candidate-popup.component.html',
  styleUrl: './apply-candidate-popup.component.css'
})
export class ApplyCandidatePopupComponent {
  @Input() isModalOpen: boolean = false;
  @Input() jobName: string | undefined;
  @Input() jobUnit: string | undefined;
  @Output() closePopup = new EventEmitter<void>();

  isAccepted: boolean = false;

  accept() {
    this.isAccepted = true;
  }
}
