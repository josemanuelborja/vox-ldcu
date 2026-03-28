import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  // Student name shown in the navbar
  studentName: string = 'Jose Borja';

  // This will hold the list of reports (wala pay sulod)
  reports: any[] = [];

  showSnackbar: boolean = false;
  snackbarMessage: string = '';

  // Dropdown toggle
  isDropdownOpen: boolean = false;
  
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

   ngOnInit() {
    this.loadReports();

    const message = localStorage.getItem('snackbar');
    if (message) {
      this.showMessage(message);
      localStorage.removeItem('snackbar');
    }

    
  }

  showMessage(message: string) {
  this.snackbarMessage = message;
  this.showSnackbar = true;

  setTimeout(() => {
    this.showSnackbar = false;
  }, 2000);
}

  loadReports() {
    const saved = localStorage.getItem('reports');
    this.reports = saved ? JSON.parse(saved) : [];
  }


  onViewReport(report: any) {
    localStorage.setItem('selectedReport', JSON.stringify(report));
    this.router.navigate(['/reportDetails']);
  }

  // Toggle the dropdown menu
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onSubmitReport() {
    this.router.navigate(['/ticket']);
  }


  onLogout() {
    this.router.navigate(['/login']);
  }
}