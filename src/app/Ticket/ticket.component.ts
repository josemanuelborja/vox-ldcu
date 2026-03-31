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
  onSubmit() {
    
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

    const newReport = {
      title: this.title,
      reportType: this.reportType,
      category: this.category,
      description: this.description,
      attachment: this.attachment ? this.attachment.name : 'No attachment',
      date: new Date().toLocaleString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}),
      status: 'Submitted',
      submittedBy: 'Ashton Nathanel A. Lactuan'
    }

    const existing = localStorage.getItem('reports');
    const reports = existing  ? JSON.parse(existing) : [];
    reports.unshift(newReport);
    localStorage.setItem('reports', JSON.stringify(reports));

    // If all fields are filled
    this.errorMessage = '';
  
    // submit report ni padulong dashboard
    this.router.navigate(['/dashboard']); 
  }

  // kani pabalik ni sya sa dashboard
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}