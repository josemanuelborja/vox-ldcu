import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ReportDetails.component.html',
  styleUrls: ['./ReportDetails.component.scss']
})
export class ReportDetailsComponent implements OnInit {

  
  report: any = null;

  constructor(private router: Router) {}

  // Runs when page loads — kwaon ang selected report sa localStorage
  ngOnInit() {
    const saved = localStorage.getItem('selectedReport');
    this.report = saved ? JSON.parse(saved) : null;
  }

  
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}