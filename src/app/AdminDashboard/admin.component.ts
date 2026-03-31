import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {

  @ViewChild('barChart') barChartRef!: ElementRef;

  studentName: string = 'Admin';
  isDropdownOpen: boolean = false;
  isStatusFilterOpen: boolean = false;
  isTypeFilterOpen: boolean = false;
  chart: any = null;
  
  totalReports = 4;
  submitted = 2;
  inProgress = 1;
  resolved = 1;
  filterStatus = 'All Status';
  filterType = 'All Reports';

  reports: any[] = [];

  get filteredReports() {
  return this.reports.filter(report => {
    const statusMatch = this.filterStatus === 'All Status' || report.status === this.filterStatus;
    const typeMatch = this.filterType === 'All Reports' || report.reportType === this.filterType;
    return statusMatch && typeMatch;
  });
}

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

  }

  loadReports() {
    const saved = localStorage.getItem('reports');
    this.reports = saved ? JSON.parse(saved) : [];
  }

  ngAfterViewInit() {
    this.initChart();
  }

  initChart() {
    this.chart = new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
          label: 'Reports',
          data: [35, 47, 35, 36, 35, 47, 47, 47, 47, 47, 47, 36],
          backgroundColor: 'rgb(131, 58, 58)',
          borderWidth: 0
        }]
      },
      options: {
        maintainAspectRatio: false,
        animations: {
            y: {
            duration: 800,
            easing: 'easeInOutQuart',
            from: 1000
            }
        },
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  onViewReport(report: any) {
    localStorage.setItem('selectedReport', JSON.stringify(report));
    this.router.navigate(['/ticketDetails']);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}