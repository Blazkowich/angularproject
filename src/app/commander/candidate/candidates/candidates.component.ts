import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CandidateService } from '../../../services/candidates.service';
import { Candidate } from '../../../models/candidates.model';
import { filter } from 'rxjs';
import { ImageComponent } from '../../../shared/image/image.component';
import { FilterPipe } from '../../../shared/filterPipe/filter.pipe';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageComponent, FilterPipe],
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.css'
})
export class CandidatesComponent implements OnInit {
  candidates: Candidate[] = [];
  jobId: string = '';
  allCandidates: Candidate[] = [];
  currentFilter: 'preferred' | 'rejected' | 'pending' | 'all' = 'all';
  isMainActive: boolean = false;
  isCandidatesActive: boolean = false;
  isPreferableActive: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private candidateService: CandidateService,
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = router.url;
      this.isMainActive = currentUrl === '/' || /\/job-details(\/\d+)?$/.test(currentUrl);
      this.isCandidatesActive = /\/job-details\/\d+\/candidates$/.test(currentUrl);
      this.isPreferableActive = /\/job-details\/\d+\/candidates\/preferred$/.test(currentUrl);
    });
  }

  ngOnInit(): void {
    this.jobId = localStorage.getItem('jobId')!;
    this.loadCandidates();
    this.checkFilter();
  }

  private loadCandidates(): void {
    this.candidateService.getCandidates().subscribe({
      next: (candidates: Candidate[]) => {
        this.allCandidates = candidates;
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        alert('Failed to load candidates. Please try again later.');
      }
    });
  }

  private applyFilter(): void {
    if (this.jobId) {
      if (this.isPreferableActive) {
        this.candidates = this.allCandidates.filter(candidate => candidate.jobStatuses[this.jobId] === 'preferred');
      } else if (this.isCandidatesActive) {
        this.candidates = this.allCandidates.filter(candidate =>
          candidate.jobStatuses[this.jobId] === 'pending' || candidate.jobStatuses[this.jobId] === 'rejected');
      } else {
        this.candidates = this.allCandidates;
      }
    }
  }

  private checkFilter(): void {
    this.route.url.subscribe(url => {
      if (url.some(segment => segment.path === 'preferred')) {
        this.currentFilter = 'preferred';
      } else if (url.some(segment => segment.path === 'rejected')) {
        this.currentFilter = 'rejected';
      } else {
        this.currentFilter = 'all';
      }
      this.applyFilter();
    });
  }

  goBack() {
    this.router.navigate([`/job-details/${this.jobId}`]);
  }

  goToCandidates() {
    this.router.navigate([`/job-details/${this.jobId}/candidates`]);
  }

  gotToPreferableCandidates() {
    this.router.navigate([`/job-details/${this.jobId}/candidates/preferred`]);
  }

  // For the Candidates section
  shouldShowCandidatesText(): boolean {
    const pendingCandidates = this.candidates.filter(c => c.jobStatuses[this.jobId] === 'pending');
    const result = pendingCandidates.length === 0;
    return result;
  }

  // For the Preferable Candidates section
  shouldShowPreferableText(): boolean {
    const preferredCandidates = this.candidates.filter(c => c.jobStatuses[this.jobId] === 'preferred');
    const result = preferredCandidates.length === 0;
    return result;
  }
}
