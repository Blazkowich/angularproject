import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Candidate } from '../../models/candidates.model';
import { CandidateService } from '../../services/candidates.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    id: '1',
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
    private route: ActivatedRoute,
    private router: Router)
  {}

  ngOnInit(): void {
    const id = '1';
    this.jobId = localStorage.getItem('jobId')!;

    if (id) {
      this.candidateSub = this.candidateService.getCandidateById(id).subscribe({
        next: candidate => {
          this.candidate = candidate;
        },
        error: (err) => {
          console.error('Error fetching candidate data:', err);
        }
      });
    } else {
      console.log('Candidate ID not found');
    }
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
}
