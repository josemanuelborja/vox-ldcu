import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  
  email: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  
  onReset() {
    // Check if email is empty
    if (!this.email) {
      this.errorMessage = 'Please enter your student email.';
      return;
    }

    // Check if email is valid
    if (!this.email.includes('@liceo.edu.ph')) {
      this.errorMessage = 'Please enter a valid student email.';
      return;
    }

    this.errorMessage = '';

    localStorage.setItem('resetEmail', this.email);
    this.router.navigate(['/resetOtp']);

    // ✅ Send OTP sa background
    this.http.post<any>('http://localhost:3000/api/otp/send', { email: this.email }).subscribe({
      next: () => console.log('OTP sent'),
      error: (err) => console.error('Failed to send OTP', err)
    });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}