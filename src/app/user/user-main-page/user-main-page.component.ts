import { CandidateService } from './../../services/candidates.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/role.model';
import { Candidate } from '../../models/candidates.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-main-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-main-page.component.html',
  styleUrl: './user-main-page.component.css'
})
export class UserMainPageComponent implements OnInit{
  searchQuery = '';
  candidate: Candidate | undefined;

  roles: Role[] = [
    { title: 'UX Designer', unit: 'Technological unit' },
    { title: 'Implements systems', unit: 'Technological unit' },
    { title: 'TSA farm', unit: 'Technological unit' },
    { title: 'Software tester', unit: 'Technological unit' },
    { title: 'Non-commissioned officer Mashan', unit: 'Technological unit' },
    { title: 'UX Designer', unit: 'Technological unit' },
    { title: 'Implements systems', unit: 'Technological unit' },
    { title: 'TSA farm', unit: 'Technological unit' },
    { title: 'Software tester', unit: 'Technological unit' },
    { title: 'Non-commissioned officer Mashan', unit: 'Technological unit' },
  ];

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    document.documentElement.style.setProperty('--background-color', 'white');
    this.candidateService.getCandidateById("1").subscribe({
      next: (candidate: Candidate) => {
        this.candidate = candidate;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }
}
