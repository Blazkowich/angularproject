import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CandidateService } from '../../../services/candidates.service';
import { Candidate } from '../../../models/candidates.model';
import { filter } from 'rxjs';
import { ImageComponent } from '../../../shared/image/image.component';
import { FilterPipe } from '../../../shared/filterPipe/filter.pipe';
import { Job } from '../../../models/jobs.model';

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
    private location: Location
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = router.url;
      this.isMainActive = currentUrl === '/' || /\/job-details(\/\d+)?$/.test(currentUrl);
      this.isCandidatesActive = currentUrl === '/candidates';
      this.isPreferableActive = currentUrl === '/candidates/preferred';
    });
  }

  ngOnInit(): void {
    this.loadCandidates();
    this.checkFilter();
    this.jobId = localStorage.getItem('jobId')!;
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
    if (this.isPreferableActive) {
      this.candidates = this.allCandidates.filter(candidate => candidate.status === 'preferred');
    } else if (this.isCandidatesActive) {
      this.candidates = this.allCandidates.filter(candidate => candidate.status === 'pending' || candidate.status === 'rejected');
    } else {
      this.candidates = this.allCandidates;
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
    this.router.navigate(['/candidates']);
  }

  gotToPreferableCandidates() {
    this.router.navigate(['/candidates/preferred']);
  }

  goToRejectedCandidates() {
    this.router.navigate(['/candidates/rejected']);
  }

  // For the Candidates section
  shouldShowCandidatesText(): boolean {
    return this.candidates.length === 0;
  }

  // For the Preferable Candidates section
  shouldShowPreferableText(): boolean {
    return this.candidates.length === 0 || this.candidates.every(c => c.status !== 'preferred');
  }
}
