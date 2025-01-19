import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CandidateService } from '../../../services/candidates.service';
import { Candidate } from '../../../models/candidates.model';
import { filter, Subscription } from 'rxjs';
import { ImageComponent } from '../../../shared/image/image.component';
import { FilterPipe } from '../../../shared/filterPipe/filter.pipe';
import { Interview } from '../../../models/interview.model';
import { InterviewSummaryPopupComponent } from '../../popups/interview-summary-popup/interview-summary-popup.component';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageComponent, FilterPipe, InterviewSummaryPopupComponent],
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.css'
})
export class CandidatesComponent implements OnInit, OnDestroy {
  candidates: Candidate[] = [];
  jobId: string = '';
  allCandidates: Candidate[] = [];
  currentFilter: 'preferred_final' | 'preferred' | 'rejected' | 'pending' | 'all' = 'all';
  isMainActive: boolean = false;
  isCandidatesActive: boolean = false;
  isPreferableActive: boolean = false;
  isSelectedCandidatesActive: boolean = false;
  showInterviewPopup = false;
  interviewNotes: string = '';
  candidateSummary: Candidate | undefined;
  interview: Interview | null = null;
  private interviewSub: Subscription | undefined;

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
      this.isSelectedCandidatesActive = /\/job-details\/\d+\/candidates\/preferred$/.test(currentUrl);
    });
  }

  ngOnInit(): void {
    this.jobId = localStorage.getItem('jobId')!;
    this.loadCandidates();
    this.checkFilter();
  }

  private loadInterview(): void {
    if (!this.jobId || !this.candidateSummary?.id) {
      console.error('Job ID or Candidate ID is missing');
      return;
    }

    this.interviewSub = this.candidateService
      .getInterview(this.jobId, this.candidateSummary.id)
      .subscribe({
        next: (interview) => {
          this.interviewNotes = interview?.interviewNotes || '';
          this.interview = {
            candidateId: this.candidateSummary!.id,
            jobId: this.jobId,
            interviewNotes: this.interviewNotes,
            interviewDate: null,
            automaticMessage: '',
            fullName: this.candidateSummary!.fullName,
            email: this.candidateSummary!.email,
            status: this.candidateSummary!.jobStatuses[this.jobId]
          };
        },
        error: (error) => console.error('Failed to load interview:', error)
      });
  }

  private loadCandidates(): void {
    this.candidateService.getCandidatesForJob(this.jobId).subscribe({
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
        this.candidates = this.allCandidates.filter(candidate =>
          candidate.jobStatuses[this.jobId] === 'preferred' ||
          candidate.jobStatuses[this.jobId] === 'preferred_final'
        );
      } else if (this.isCandidatesActive) {
        this.candidates = this.allCandidates.filter(candidate =>
          candidate.jobStatuses[this.jobId] === 'pending' ||
          candidate.jobStatuses[this.jobId] === 'rejected'
        );
      } else {
        this.candidates = this.allCandidates;
      }
    }
  }

  private checkFilter(): void {
    this.route.url.subscribe(url => {
      if (url.some(segment => segment.path === 'preferred')) {
        this.currentFilter = 'preferred';
      } else if (url.some(segment => segment.path === 'preferred_final')) {
        this.currentFilter = 'preferred_final';
      } else if (url.some(segment => segment.path === 'rejected')) {
        this.currentFilter = 'rejected';
      } else {
        this.currentFilter = 'all';
      }
      this.applyFilter();
    });
  }

  openInterviewSummary(candidate: Candidate): void {
    this.candidateSummary = candidate;
    this.loadInterview();
    this.showInterviewPopup = true;
  }

  handleInterviewSave(result: any): void {
    if (!this.candidateSummary || !this.jobId) {
      console.error('Candidate or Job ID is missing.');
      return;
    }

    const interviewData: Interview = {
      candidateId: this.candidateSummary.id,
      jobId: this.jobId,
      interviewNotes: result.summary,
      interviewDate: null,
      automaticMessage: '',
      fullName: this.candidateSummary.fullName,
      email: this.candidateSummary.email,
      status: this.candidateSummary.jobStatuses[this.jobId],
    };

    if (this.interviewNotes) {
      this.candidateService.updateInterview(interviewData, this.jobId, this.candidateSummary.id).subscribe({
        next: () => {
          this.loadInterview();
          this.showInterviewPopup = false;
        },
        error: (error) => console.error('Failed to update interview:', error),
      });
    } else {
      this.candidateService.saveInterview(interviewData, this.jobId, this.candidateSummary.id).subscribe({
        next: () => {
          this.loadInterview();
          this.showInterviewPopup = false;
        },
        error: (error) => console.error('Failed to save interview:', error),
      });
    }
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

  contactCandidate(candidateId: string) {
    this.router.navigate([`/interview-summary/${candidateId}`]);
  }

  goToCandidateProfile(candidateId: string) {
    this.router.navigate([`/candidate-profile/${candidateId}`]);
  }

  goToCandidateDetails(candidateId: string) {
    this.router.navigate([`/candidate-details/${candidateId}`]);
  }

  // For the Candidates section
  shouldShowCandidatesText(): boolean {
    const pendingCandidates = this.candidates.filter(c => c.jobStatuses[this.jobId] === 'pending');
    const result = pendingCandidates.length === 0;
    return result;
  }

  // For the Preferable Candidates section
  shouldShowPreferableText(): boolean {
    const preferredCandidates = this.candidates.filter(c =>
      c.jobStatuses[this.jobId] === 'preferred' ||
      c.jobStatuses[this.jobId] === 'preferred_final'
    );
    return preferredCandidates.length === 0;
  }

  ngOnDestroy(): void {
    if (this.interviewSub) {
      this.interviewSub.unsubscribe();
    }
  }
}
