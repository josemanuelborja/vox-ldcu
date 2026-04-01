import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { TicketService } from '../services/ticket/ticket.service';

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
  isLoading = true;
  chart: any = null;
  
  totalReports = 0;
  submitted = 0;
  inProgress = 0;
  resolved = 0;
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
    await this.loadReports();
  }

    async loadReports() {
    try {
      const res = await this.ticketService.getTickets(0);
      this.reports = res.map((r: any) => ({
        id: r.id,
        title: r.title,
        reportType: r.type_of_report,
        category: r.category,
        description: r.description,
        attachment: r.attachment ?? 'No attachment',
        date: new Date(r.create_time).toLocaleString('en-US', {
          month: '2-digit', day: '2-digit', year: 'numeric'
        }),
        status: r.status,
        submittedBy: r.submitted_by,
        create_time: r.create_time
      }));

      this.totalReports = this.reports.length;
      this.submitted = this.reports.filter(r => r.status === 'submitted').length;
      this.inProgress = this.reports.filter(r => r.status === 'in_progress').length;
      this.resolved = this.reports.filter(r => r.status === 'resolved').length;

      this.updateChart();

      this.cdr.detectChanges();
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  updateChart() {
  const monthlyCounts = Array(12).fill(0);

  this.reports.forEach(r => {
    const month = new Date(r.create_time).getMonth();
    monthlyCounts[month]++;
  });

  if (this.chart) {
    this.chart.data.datasets[0].data = monthlyCounts;

    const maxCount = Math.max(...monthlyCounts);
    this.chart.options.scales['y'].max = maxCount + 1; 
    this.chart.options.scales['y'].ticks = {
      stepSize: 0.5
    };

    this.chart.update();
  }
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