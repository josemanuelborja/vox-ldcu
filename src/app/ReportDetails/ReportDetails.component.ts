import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ReportDetails.component.html',
  styleUrls: ['./ReportDetails.component.scss']
})
export class ReportDetailsComponent implements OnInit {

  
  report: any = null;
  adminResponses: any[] = [];
  submittedBy: string = '';

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

  constructor(private router: Router) {}

  // Runs when page loads — kwaon ang selected report sa localStorage
  ngOnInit() {

    const saved = localStorage.getItem('selectedReport');
    this.report = saved ? JSON.parse(saved) : null;

    if (this.report) {
      this.report.category = this.capitalize(this.report.category);
      this.report.reportType = this.capitalize(this.report.reportType);
      this.submittedBy = this.report.submittedBy;
      const responses = localStorage.getItem('responses_' + this.report.id);
      this.adminResponses = responses ? JSON.parse(responses) : [];
    }

  }
  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}