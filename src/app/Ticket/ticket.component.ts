import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent {

  // These variables store what the user types
  title: string = '';
  reportType: string = '';
  category: string = '';
  description: string = '';
  attachment: File | null = null;
  errorMessage: string = '';
  isSubmitting = false;

  errors = {
    title: '',
    reportType: '',
    category: '',
    description: '',
    attachment: ''
  };

  // Dropdown options
  reportTypes: string[] = ['Complaint', 'Suggestion'];
  categories: string[] = ['Facilities', 'Faculty', 'Administration', 'Others'];

  constructor(private router: Router, private ticketService: TicketService) {}

  // This runs when user picks a file
  onFileChange(event: any) {
  const file = event.target.files[0];

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    this.errors.attachment = 'Only image files are allowed (jpg, png, gif, webp).';
    this.attachment = null;
    event.target.value = '';
    return;
  }

  this.errors.attachment = '';
  this.attachment = file;
}

  // This runs when user clicks "Submit Report"
  async onSubmit() {
    
    this.errors = {title: '', reportType: '', category: '', description: '',attachment: ''};

    if (!this.title) {
      this.errors.title = 'Title is required.';
    }

    if (!this.reportType) {
      this.errors.reportType = 'Please select a type of report.';
    }

    if (!this.category) {
      this.errors.category = 'Please select a category.';
    }

    if (!this.description) {
      this.errors.description = 'Description is required.';
    }


    if (this.errors.title || this.errors.reportType || this.errors.category || this.errors.description) {
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('user') ?? '{}');

    const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('title', this.title);
      formData.append('type_of_report', this.reportType.toLowerCase());
      formData.append('category', this.category.toLowerCase());
      formData.append('description', this.description);
      if (this.attachment) {
        formData.append('attachment', this.attachment); 
      } 

    this.isSubmitting = true;

    try {
      await this.ticketService.createTicket(formData);
      toast.success('Report submitted successfully!');
      this.router.navigate(['/dashboard']);
    } catch (err) {
      toast.error('Failed to submit report. Please try again.');
      this.errorMessage = 'Failed to submit report. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
  // kani pabalik ni sya sa dashboard
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}