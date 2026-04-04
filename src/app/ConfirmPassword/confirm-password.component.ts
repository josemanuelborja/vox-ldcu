import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-confirmpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent {

  newPassword = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(private router: Router, private http: HttpClient) {}

  onReset() {
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const email = localStorage.getItem('resetEmail');

    this.http.post<any>('http://localhost:3000/api/auth/reset-password', {
      email,
      password: this.newPassword
    }).subscribe({
      next: () => {
        localStorage.removeItem('resetEmail');
        toast.success('Password reset successfully!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Failed to reset password.';
      }
    });
  }
}