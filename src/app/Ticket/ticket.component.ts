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

  // Dropdown options
  reportTypes: string[] = ['Complaint', 'Suggestion', 'Inquiry'];
  categories: string[] = ['Facilities', 'Faculty', 'Administration', 'Others'];

  constructor(private router: Router) {}

  // This runs when user picks a file
  onFileChange(event: any) {
    this.attachment = event.target.files[0];
  }

  // This runs when user clicks "Submit Report"
  onSubmit() {
    // Check if all required fields are filled
    if (!this.title || !this.reportType || !this.category || !this.description) {
      this.errorMessage = 'Please fill in all required fields.';
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