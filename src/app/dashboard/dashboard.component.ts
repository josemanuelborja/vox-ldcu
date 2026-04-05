import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TicketService } from '../services/ticket/ticket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  // Student name shown in the navbar
  studentName: string = '';
 // This will hold the list of reports (wala pay sulod)
  reports: any[] = [];
 // Dropdown toggle
  isDropdownOpen: boolean = false;
  isLoading = true;
  
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
  

  constructor(private router: Router, private ticketService: TicketService, private cdr: ChangeDetectorRef) {}

   async ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('user') ?? '{}');
    this.studentName = user.full_name;
    await this.loadReports(user.id);
  }

  async loadReports(userId: number) {
    try {
      const res = await this.ticketService.getTickets(userId);
      this.reports = res.map((r: any) => ({
        id: r.id,
        title: r.title,
        reportType: this.capitalize(r.type_of_report),
        category: this.capitalize(r.category),
        description: r.description,
        attachment: r.attachment ?? 'No attachment',
        date: new Date(r.create_time).toLocaleString('en-US', {
          month: '2-digit', day: '2-digit', year: 'numeric'
        }),
        status: r.status,
        submittedBy: r.submitted_by
      }));
      this.cdr.detectChanges();
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
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
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}