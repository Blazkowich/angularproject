import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CandidateService } from '../../services/candidates.service';
import { Candidate } from '../../models/candidates.model';
import { filter } from 'rxjs';
import { ImageComponent } from '../../shared/image/image.component';
import { FilterPipe } from '../../shared/filterPipe/filter.pipe';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageComponent, FilterPipe],
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.css'
})
export class CandidatesComponent implements OnInit {
  candidates: Candidate[] = [];
  allCandidates: Candidate[] = [];
  currentFilter: 'preferred' | 'rejected' | 'neutral' | 'all' = 'all';
  isMainActive: boolean = false;
  isCandidatesActive: boolean = false;
  isPreferableActive: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private candidateService: CandidateService
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
    if (this.currentFilter === 'all') {
      this.candidates = this.allCandidates;
    } else {
      this.candidates = this.allCandidates.filter(candidate => candidate.status === this.currentFilter);
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
    this.router.navigate(['/open-jobs']);
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
