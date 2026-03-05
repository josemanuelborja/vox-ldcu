import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  // Student name shown in the navbar
  studentName: string = 'Jose Borja';

  // This will hold the list of reports (wala pay sulod)
  reports: any[] = [];

  // Dropdown toggle
  isDropdownOpen: boolean = false;

  constructor(private router: Router) {}

  // Toggle the dropdown menu
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Go to submit report page (create this later)
  onSubmitReport() {
    alert('Submit Report clicked! (Add submit report page later)');
  }

  // Logout function
  onLogout() {
    this.router.navigate(['/login']);
  }
}