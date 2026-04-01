import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { TicketService } from '../../services/ticket/ticket.service';

@Component({
  selector: 'app-report-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {

  report: any = null;
  selectedStatus: string = 'submitted';
  newComment: string = '';
  adminResponses: any[] = [];
  isStatusOpen: boolean = false;

   statusOptions = [
    { value: 'submitted', label: 'Submitted' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  selectStatus(status: string) {
    this.selectedStatus = status;
    this.isStatusOpen = false;
    this.onSave();
  }

   getStatusLabel(status: string): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'submitted': return 'status-submitted';
      case 'in_progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return '';
    }
  }
  

  constructor(private router: Router, private ticketService: TicketService) {}

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

  async onSave() {
    if (!this.newComment.trim() && this.selectedStatus === this.report.status) {
      return;
    }

    // Save comment to localStorage
    if (this.newComment.trim()) {
      const response = {
        name: 'Admin',
        date: new Date().toLocaleString(),
        message: this.newComment
      };
      this.adminResponses.push(response);
      localStorage.setItem('responses_' + this.report.id, JSON.stringify(this.adminResponses));
      this.newComment = '';
    }

    // ✅ UPDATE status sa backend
    if (this.selectedStatus !== this.report.status) {
      try {
        await this.ticketService.updateStatus(this.report.id, this.selectedStatus);
        
        // ✅ Update locally after successful backend update
        this.report.status = this.selectedStatus;
        localStorage.setItem('selectedReport', JSON.stringify(this.report));
      } catch (err) {
        console.error('Failed to update status', err);
      }
    }
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