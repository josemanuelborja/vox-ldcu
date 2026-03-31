import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-report-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {

  report: any = null;
  selectedStatus: string = 'Submitted';
  newComment: string = '';
  adminResponses: any[] = [];
 isStatusOpen: boolean = false;

  selectStatus(status: string) {
    this.selectedStatus = status;
    this.isStatusOpen = false;
  }

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

    if (this.report) {
      this.selectedStatus = this.report.status;
      const responses = localStorage.getItem('responses_' + this.report.id);
      this.adminResponses = responses ? JSON.parse(responses) : [];
    }

  }

  onSave() {

    if (!this.newComment.trim() && this.selectedStatus === this.report.status) {
      return;
    }
    // Save comment
    if (this.newComment.trim()) {
      const response = {
        name: 'Test Admin',
        date: new Date().toLocaleString(),
        message: this.newComment
      };
      this.adminResponses.push(response);
      localStorage.setItem('responses_' + this.report.id, JSON.stringify(this.adminResponses));
      this.newComment = '';
    }

    // Save status
    this.report.status = this.selectedStatus;
    localStorage.setItem('selectedReport', JSON.stringify(this.report));

    let reports = JSON.parse(localStorage.getItem('reports') || '[]');
    for (let i = 0; i < reports.length; i++) {
      if (reports[i].id === this.report.id) {
        reports[i].status = this.selectedStatus;  
        break;
      }
    }
    localStorage.setItem('reports', JSON.stringify(reports));

  }

  onDeleteResponse(response: any) {
  this.adminResponses = this.adminResponses.filter(r => r !== response);
  localStorage.setItem('responses_' + this.report.id, JSON.stringify(this.adminResponses));
}

  onCancel() {
    if (this.newComment.trim() || this.selectedStatus !== this.report.status) {
      this.newComment = '';
      this.selectedStatus = this.report.status;
    }
  }

  
  goBack() {
    this.router.navigate(['/adminDashboard']);
  }
}