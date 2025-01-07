import { Component } from '@angular/core';
import { ControlIconsComponent } from "../../shared/control-icons/control-icons.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'commander-create-job',
  standalone: true,
  imports: [ControlIconsComponent, FormsModule, CommonModule],
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent {
  jobName: string = '';
  jobCategory: string = '';
  unit: string = '';
  address: string = '';
  positions: number | null = null;
  openBase: boolean = false;
  closedBase: boolean = false;
  progressNumber: number = 25;

  // Flags for form validation and page transitions
  isFirstFormValid: boolean = false;
  isSecondFormValid: boolean = false;
  isThirdFormValid: boolean = false;

  isPage1Completed: boolean = false;
  isPage2Completed: boolean = false;
  isPage3Completed: boolean = false;

  // Page 1 validation
  validateFirstPageFields(): void {
    this.isFirstFormValid =
      this.jobName.trim() !== '' &&
      this.jobCategory.trim() !== '' &&
      this.unit.trim() !== '' &&
      this.address.trim() !== '' &&
      this.positions !== null &&
      (this.openBase || this.closedBase);

    this.isFirstFormValid = Boolean(this.isFirstFormValid);
  }

  goToNextPage(): void {
    if (this.isFirstFormValid) {
      this.isPage1Completed = true;
      this.progressNumber = 50;
    }
  }

  // Page 2 validation
  validateSecondPageFields(): void {
    this.isSecondFormValid =
      this.address.trim() !== '' &&
      (this.openBase || this.closedBase);

    this.isSecondFormValid = Boolean(this.isSecondFormValid);
    console.log('Page 2 Form Valid:', this.isSecondFormValid);
  }

  goToThirdPage(): void {
    if (this.isSecondFormValid) {
      this.isPage2Completed = true;
      this.progressNumber = 75;
    }
  }

  // Page 3 validation
  validateThirdPageFields(): void {
    // this.isThirdFormValid =
    //   this.job.trim() !== '' &&
    //   this.additionalField2.trim() !== '';

    // this.isThirdFormValidPage3 = Boolean(this.isThirdFormValid);
    // console.log('Page 3 Form Valid:', this.isThirdFormValid);
  }


    goToFourthPage(): void {
      if (this.isThirdFormValid) {
        this.isPage3Completed = true;
        this.progressNumber = 100;
      }
    }
}
