import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  // This runs when user picks a file
  onFileChange(event: any) {
    this.attachment = event.target.files[0];
    this.errors.attachment = '';
  }

  // This runs when user clicks "Submit Report"
  onSubmit() {
    
    this.errors = {title: '', reportType: '', category: '', description: '', attachment: ''};

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

    if (!this.attachment) {
      this.errors.attachment = 'Attachment is required';
    }

    if (this.errors.title || this.errors.reportType || this.errors.category || this.errors.description || this.errors.attachment) {
      return;
    }

    // If all fields are filled
    this.errorMessage = '';
    alert('Report submitted successfully!');

    // TODO: Replace alert with real API call later
    this.router.navigate(['/dashboard']);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}