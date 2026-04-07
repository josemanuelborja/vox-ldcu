import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResponseService } from '../services/response/response.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-report-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ReportDetails.component.html',
  styleUrls: ['./ReportDetails.component.scss']
})
export class ReportDetailsComponent implements OnInit {

  
  report: any = null;
  adminResponses: any[] = [];
  submittedBy: string = '';
  newComment = ''; 
  isSubmitting = false; 

  getStatusClass(status: string): string {
    switch (status) {
      case 'submitted': return 'status-submitted';
      case 'in_progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
  switch (status) {
    case 'submitted': return 'Submitted';
    case 'in_progress': return 'In Progress';
    case 'resolved': return 'Resolved';
    case 'closed': return 'Closed';
    default: return status;
  }
}

  constructor(private router: Router, private responseService: ResponseService, private cdr: ChangeDetectorRef) {}

  // Runs when page loads — kwaon ang selected report sa localStorage
   async ngOnInit() {

    const saved = localStorage.getItem('selectedReport');
    this.report = saved ? JSON.parse(saved) : null;

    if (this.report) {
      this.report.category = this.capitalize(this.report.category);
      this.report.reportType = this.capitalize(this.report.reportType);
      this.submittedBy = this.report.submittedBy;
      await this.loadResponses(); 
    }
  }

  async loadResponses() {
    try {
      const res = await this.responseService.getResponses(this.report.id);
      this.adminResponses = res.map(r => ({
        id: r.id,
        name: r.admin_name,
        date: new Date(r.created_at).toLocaleString(),
        message: r.message
      }));
      this.cdr.detectChanges();
    } catch (err) {
      console.error(err);
    }
  }

  async onSave() {
    if (!this.newComment.trim()) return;

    const user = JSON.parse(sessionStorage.getItem('user') ?? '{}');

    this.isSubmitting = true;
    try {
      const res = await this.responseService.createResponse({
        ticket_id: this.report.id,
        admin_name: user.full_name,
        message: this.newComment
      });

      this.adminResponses.push({
        id: res.id,
        name: res.admin_name,
        date: res.created_at ? new Date(res.created_at).toLocaleString() : new Date().toLocaleString(),
        message: res.message
      });

      this.newComment = '';
      this.cdr.detectChanges();
      toast.success('Comment submitted!');
    } catch (err) {
      toast.error('Failed to submit comment.');
    } finally {
      this.isSubmitting = false;
    }
  }
  
  onCancel() {
    this.newComment = '';
    this.cdr.detectChanges();
  }
  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}