import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { TicketService } from '../../services/ticket/ticket.service';
import { ResponseService } from '../../services/response/response.service';
import { toast } from 'ngx-sonner';

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
  editingResponseId: number | null = null;
  editingMessage: string = '';
  openMenuId: number | null = null;
  isLightboxOpen = false;

   statusOptions = [
    { value: 'submitted', label: 'Submitted' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  selectStatus(status: string) {
    this.selectedStatus = status;
    this.isStatusOpen = false;
    this.cdr.detectChanges();
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

  onEditResponse(response: any) {
    this.editingResponseId = response.id;
    this.editingMessage = response.message;
    this.cdr.detectChanges();
  }
  

  constructor(private router: Router, private ticketService: TicketService, private responseService: ResponseService, private cdr: ChangeDetectorRef) {}

  // Runs when page loads — kwaon ang selected report sa localStorage
  async ngOnInit() {
    const saved = localStorage.getItem('selectedReport');
    this.report = saved ? JSON.parse(saved) : null;

    if (this.report) {
      this.report.category = this.capitalize(this.report.category);
      this.report.reportType = this.capitalize(this.report.reportType);
      this.selectedStatus = this.report.status;
      await this.loadResponses(); 
    }
  }

  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async loadResponses() {
    try {
      const res = await this.responseService.getResponses(this.report.id);
      this.adminResponses = res.map(r => ({
        id: r.id,
        name: r.admin_name,
        date: new Date(r.created_at).toLocaleString(),
        message: r.message,
        is_edited: r.is_edited
      }));
      this.cdr.detectChanges();
    } catch (err) {
      console.error(err);
    }
  }

  async onSave() {
    const statusChanged = this.selectedStatus !== this.report.status;
    const hasComment = this.newComment.trim();

    if (!hasComment && !statusChanged) return;

    // Save comment to localStorage
    if (hasComment) {
      try {
        const res = await this.responseService.createResponse({
          ticket_id: this.report.id,
          admin_name: 'Admin',
          message: this.newComment
        });
        this.adminResponses.push({
          id: res.id,
          name: res.admin_name,
          date: res.created_at ? new Date(res.created_at).toLocaleString() : new Date().toLocaleString(),
          message: res.message,
          is_edited: false
        });
        this.newComment = '';
        this.cdr.detectChanges();
        toast.success('Saved successfully!')
      } catch (err) {
        toast.error('Failed to save response.');
      }
    }

    // UPDATE status sa backend
    if (this.selectedStatus !== this.report.status) {
      try {
        await this.ticketService.updateStatus(this.report.id, this.selectedStatus);
        this.report.status = this.selectedStatus;
        localStorage.setItem('selectedReport', JSON.stringify(this.report));
        this.cdr.detectChanges();
        toast.success('Saved successfully!')
      } catch (err) {
        toast.error('Failed to update status.');
      }
    }
  }

  async onDeleteResponse(response: any) {
    try {
      await this.responseService.deleteResponse(response.id);
      this.adminResponses = this.adminResponses.filter(r => r.id !== response.id);
      this.cdr.detectChanges();
      toast.success('Deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete response.');
    }
  }

  async onSaveEdit(response: any) {
    if (!this.editingMessage.trim()) return;
    try {
      await this.responseService.updateResponse(response.id, this.editingMessage);
      response.message = this.editingMessage;
      response.is_edited = true;
      this.editingResponseId = null;
      this.cdr.detectChanges();
      toast.success('Comment updated!');
    } catch (err) {
      toast.error('Failed to update comment.');
    }
  }

  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
    this.cdr.detectChanges();
  }

   openLightbox() {
    this.isLightboxOpen = true;
    this.cdr.detectChanges();
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    this.cdr.detectChanges();
  }

  onCancelEdit() {
    this.editingResponseId = null;
    this.editingMessage = '';
    this.cdr.detectChanges();
  }

  onCancel() {
    if (this.newComment.trim() || this.selectedStatus !== this.report.status) {
      this.newComment = '';
      this.selectedStatus = this.report.status;
      this.cdr.detectChanges();
      toast.info('Changes cancelled.');
    }
  }

  
  goBack() {
    this.router.navigate(['/adminDashboard']);
  }
}