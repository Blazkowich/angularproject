import { CandidateMapperService } from './../../utils/candidate-mapper-commander';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Candidate } from '../../models/candidates.model';
import { CandidateService } from '../../services/candidates.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavigationComponent } from '../../shared/bottom-navigation/bottom-navigation.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavigationComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  candidate: Candidate = {
    id: '',
    fullName: '',
    idNumber: '',
    dateOfBirth: '',
    age: 0,
    gender: '',
    profile: '',
    phone: '',
    email: '',
    address: '',
    experience: '',
    education: '',
    courses: '',
    languages: '',
    interests: '',
    personalSummary: '',
    jobStatuses: {},
    imageUrl: ''
  };
  candidateSub: Subscription | undefined;
  jobId: string | undefined;

  constructor(
    private candidateService: CandidateService,
    private router: Router)
  {}

  ngOnInit(): void {
    this.jobId = localStorage.getItem('jobId')!;
    this.candidateSub = this.candidateService.getCurrentVolunteer().subscribe({
      next: candidate => {
        this.candidate = candidate;
        console.log(this.candidate);
      },
      error: (err) => {
        console.error('Error fetching candidate data:', err);
      }
    });
  }

  saveProfile() {
    if (this.candidate) {
      this.candidateService.updateCandidate(this.candidate).subscribe({
        next: () => {
          console.log('Profile updated successfully');
          this.goBack();
        },
        error: (err) => {
          console.error('Failed to update profile', err);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/roles']);
  }

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
  }

  onDateOfBirthChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const datePart = input.split(') ')[1];
    if (datePart) {
      this.candidate!.dateOfBirth = datePart.trim();
    }
  }
}
