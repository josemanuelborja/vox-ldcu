import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResponseService } from '../services/response/response.service';
import { toast } from 'ngx-sonner';
import { TicketService } from '../services/ticket/ticket.service';

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
  currentUserName: string = '';

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

  editingResponseId: number | null = null;
  editingMessage: string = '';
  openMenuId: number | null = null;

  isEditModalOpen: boolean = false;
  editForm = { title: '', type_of_report: '', category: '', description: '' };

  typeOptions = [
    { value: 'complain', label: 'Complain' },
    { value: 'suggestion', label: 'Suggestion' }
  ];

  categoryOptions = [
    { value: 'facilities', label: 'Facilities' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'administration', label: 'Administration' },
    { value: 'others', label: 'Others' }
  ];

  constructor(private router: Router, private responseService: ResponseService, private ticketService: TicketService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('user') ?? '{}');
    this.currentUserName = user.full_name ?? '';

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
        message: r.message,
        is_edited: r.is_edited
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
        message: res.message,
        is_edited: false
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

  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
    this.cdr.detectChanges();
  }

  onEditResponse(response: any) {
    this.editingResponseId = response.id;
    this.editingMessage = response.message;
    this.cdr.detectChanges();
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

  onCancelEdit() {
    this.editingResponseId = null;
    this.editingMessage = '';
    this.cdr.detectChanges();
  }
  
  onCancel() {
    this.newComment = '';
    this.cdr.detectChanges();
  }
  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
   openEditModal() {
    this.editForm = {
      title: this.report.title,
      type_of_report: this.report.reportType.toLowerCase(),
      category: this.report.category.toLowerCase(),
      description: this.report.description
    };
    this.isEditModalOpen = true;
    this.cdr.detectChanges();
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.cdr.detectChanges();
  }

  async onSaveEditReport() {
    if (!this.editForm.title.trim() || !this.editForm.description.trim()) return;
    try {
      const updated = await this.ticketService.updateTicket(this.report.id, this.editForm);
      this.report.title = updated.title;
      this.report.description = updated.description;
      this.report.category = this.capitalize(updated.category);
      this.report.reportType = this.capitalize(updated.type_of_report);
      localStorage.setItem('selectedReport', JSON.stringify(this.report));
      this.isEditModalOpen = false;
      this.cdr.detectChanges();
      toast.success('Report updated!');
    } catch (err) {
      toast.error('Failed to update report.');
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}