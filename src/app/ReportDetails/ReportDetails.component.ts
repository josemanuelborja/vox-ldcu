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

  getStatusClass(status: string): string {
    switch (status) {
      case 'Submitted': return 'status-submitted';
      case 'In Progress': return 'status-progress';
      case 'Resolved': return 'status-resolved';
      case 'Closed': return 'status-closed';
      default: return '';
    }
  }

  constructor(private router: Router) {}

  // Runs when page loads — kwaon ang selected report sa localStorage
  ngOnInit() {
    const saved = localStorage.getItem('selectedReport');
    this.report = saved ? JSON.parse(saved) : null;

    if(this.report) {
      const  responses = localStorage.getItem('responses_' + this.report.id);
      this.adminResponses = responses ? JSON.parse(responses): [];
    }

  }

  
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}