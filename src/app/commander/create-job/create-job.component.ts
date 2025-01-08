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
  jobDescription: string = '';
  additionalInfo: string = '';
  commonQuestions: string = '';
  commonAnswers: string = '';
  education: string = '';
  techSkills: string = '';
  workExperience: string = '';
  passedCourses: string = '';
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

  // Page 2 validation
  validateSecondPageFields(): void {
    this.isSecondFormValid =
      this.jobDescription.trim() !== '' &&
      this.additionalInfo.trim() !== '';

    this.isSecondFormValid = Boolean(this.isSecondFormValid);
  }

  // Page 3 validation
  validateThirdPageFields(): void {
    this.isThirdFormValid =
      this.workExperience.trim() !== '' &&
      this.education.trim() !== '' &&
      this.passedCourses.trim() !== '' &&
      this.techSkills.trim() !== '';
  }

  // Navigation method to handle moving to the next page
  goToNextPage(): void {
    if (!this.isPage1Completed) {
      this.goToSecondPage();
    } else if (!this.isPage2Completed) {
      this.goToThirdPage();
    } else if (!this.isPage3Completed) {
      this.goToFourthPage();
    }
  }

  // Go Further
  goToSecondPage(): void {
    if (this.isFirstFormValid) {
      this.isPage1Completed = true;
      this.isPage2Completed = false;
      this.isPage3Completed = false;
      this.progressNumber = 50;
    }
  }

  goToThirdPage(): void {
    if (this.isSecondFormValid) {
      this.isPage2Completed = true;
      this.isPage3Completed = false;
      this.progressNumber = 75;
    }
  }

  goToFourthPage(): void {
    if (this.isThirdFormValid) {
      this.isPage3Completed = true;
      this.progressNumber = 100;
    }
  }

  // Go Back
  goBackToFirstPage(): void {
    this.isPage1Completed = false;
    this.isPage2Completed = false;
    this.isPage3Completed = false;
    this.progressNumber = 25;
  }

  goBackToSecondPage(): void {
    this.isPage1Completed = true;
    this.isPage2Completed = false;
    this.isPage3Completed = false;
    this.progressNumber = 50;
  }

  goBackToThirdPage(): void {
    this.isPage1Completed = true;
    this.isPage2Completed = true;
    this.isPage3Completed = false;
    this.progressNumber = 75;
  }

  // Add
  addJob(): void {
    console.log('Job added');
  }
}
