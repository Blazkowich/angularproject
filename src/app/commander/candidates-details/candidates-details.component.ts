import { CandidateService } from './../../services/candidates.service';
import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../models/candidates.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Job } from '../../models/jobs.model';

@Component({
  selector: 'app-candidates-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidates-details.component.html',
  styleUrl: './candidates-details.component.css'
})
export class CandidatesDetailsComponent implements OnInit{
  candidate: Candidate | undefined;
  job: Job | undefined;
  candidateSub: Subscription | undefined;
  jobSub: Subscription | undefined;

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private location: Location) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.candidateSub = this.candidateService.getCandidateById(id).subscribe({
        next: candidate => {
          this.candidate = candidate;
        }
      });
    } else {
      console.log('Candidate ID not found');
    }
  }

  getCandidate(id: string): void {
    this.candidateService.getCandidateById(id).subscribe({
      next: candidate => this.candidate = candidate
    });
  }

  goBack() {
    this.location.back();
  }
}
