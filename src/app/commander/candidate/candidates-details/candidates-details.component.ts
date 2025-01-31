import { CandidateMapperService } from '../../../mappers/candidate-mapper-commander';
import { CandidateService } from '../../../services/candidates.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Candidate } from '../../../models/candidates.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Job } from '../../../models/jobs.model';
import { JobService } from '../../../services/jobs.service';
import { ApproveRejectPopupComponent } from '../../popups/approve-reject-popup/approve-reject-popup.component';
import { ApproveRejectEditPopupComponent } from '../../popups/approve-reject-edit-popup/approve-reject-edit-popup.component';

@Component({
  selector: 'app-candidates-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ApproveRejectPopupComponent, ApproveRejectEditPopupComponent],
  templateUrl: './candidates-details.component.html',
  styleUrl: './candidates-details.component.css'
})
export class CandidatesDetailsComponent implements OnInit, OnDestroy{
  candidate: Candidate | undefined;
  job: Job | undefined;
  jobId: string = '';
  candidateSub: Subscription | undefined;
  jobSub: Subscription | undefined;
  showPopup = false;
  isApproved = true;
  isPreviewOpen: boolean = false;
  showEditPopup = false;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.jobId = localStorage.getItem('jobId')!;
    localStorage.setItem('candidateId', id!);
    if (id) {
      this.candidateSub = this.candidateService.getCommanderCandidateById(id).subscribe({
        next: candidate => {
          this.candidate = CandidateMapperService.mapCommanderCandidateForProfile(candidate);
        }
      });
    } else {
      console.log('Candidate ID not found');
    }

    if (this.jobId) {
      this.jobSub = this.jobService.getJobById(this.jobId).subscribe({
        next: job => {
          this.job = job;
        },
        error: err => {
          console.log('Error fetching job details:', err);
        }
      });
    } else {
      console.log('Job ID not found in localStorage');
    }
  }

  onCandidatePreferredFinal() {
    if (this.candidate?.jobStatuses[this.jobId] === 'preferred') {
      this.isApproved = true;
      this.updateCandidateStatus('preferred_final');
      this.showPopup = true;
    } else {
      console.log('Cannot transition to Preferred Final unless the status is "preferred"');
    }
  }

  updateCandidateStatus(status: 'preferred' | 'rejected' | 'preferred_final') {
    if (this.jobId && this.candidate?.id) {
      this.candidateService
        .updateCandidateStatus(this.jobId, this.candidate.id, status)
        .subscribe({
          next: () => {
            if (this.candidate?.jobStatuses) {
              this.candidate.jobStatuses[this.jobId] = status;
            }
          },
          error: (err) => {
            console.log('Error updating status:', err);
          },
        });
    }
  }

  getCandidate(id: string): void {
    this.candidateService.getCandidateById(id).subscribe({
      next: candidate => this.candidate = candidate
    });
  }

  goBack() {
    this.router.navigate([`/job-details/${this.jobId}/candidates`]);
  }

  goToCandidateProfile(candidateId: string) {
    this.router.navigate([`/candidate-profile/${candidateId}`]);
  }

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
    if (this.jobSub) {
      this.jobSub.unsubscribe();
    }
  }

  openPreview(event: MouseEvent): void {
    event.stopPropagation();
    this.isPreviewOpen = true;
  }

  closePreview(event: MouseEvent): void {
    event.stopPropagation();
    this.isPreviewOpen = false;
  }

  closePreviewOnClickOutside(event: MouseEvent): void {
    if (this.isPreviewOpen) {
      this.isPreviewOpen = false;
    }
  }

  onCandidateAgree() {
    this.isApproved = true;
    this.updateCandidateStatus('preferred');
    this.showPopup = true;
    alert('המועמד אושר');
  }

  onCandidateReject() {
    this.isApproved = false;
    this.updateCandidateStatus('rejected');
    this.showPopup = true;
    alert('המועמד נדחה');
  }

  closeCandidatePopup() {
    this.showPopup = false;
    this.showEditPopup = false;
  }

  handleClose() {
    this.showEditPopup = false;
  }
}
