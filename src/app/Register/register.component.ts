import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  fullName: string = '';
  studentId: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  fullNameError: string = '';
  studentIdError: string = '';
  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';

  isLoading = false;

   constructor(private router: Router, private http: HttpClient) {}

  onRegister() {

    this.fullNameError = '';
    this.studentIdError = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.errorMessage = '';

    if (
      !this.fullName.trim() &&
      !this.studentId.trim() &&
      !this.email.trim() &&
      !this.password.trim() &&
      !this.confirmPassword.trim()
    ) {
      this.errorMessage = 'Please fill in the blank';
      return;
    }

    let hasError = false;

    if (!this.fullName) {
      this.fullNameError = 'Full name is required';
      hasError = true;
    }

    if (!this.studentId) {
      this.studentIdError = 'Student ID is required';
      hasError = true;
    } else if (!/^\d+$/.test(this.studentId)) {
        this.studentIdError = 'Student ID must be numbers only';
        hasError = true;
    }

    if (!this.email.trim) {
      this.emailError = 'Email is required';
      hasError = true;
    } else if (!this.email.includes('@liceo.edu.ph')) {
      this.emailError = 'Please use your school email (@liceo.edu.ph)';
      hasError = true;
    }

    if (!this.password.trim) {
      this.passwordError = 'Password is required';
      hasError = true;
    } else if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (!this.confirmPassword.trim) {
      this.confirmPasswordError = 'Confirm your password';
      hasError = true;
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      hasError = true;
    }

    if (hasError) return; 
    
    const payload = {
      full_name: this.fullName,
      student_id: this.studentId,
      email: this.email,
      password: this.password,
      confirm_password: this.confirmPassword
    };

    this.isLoading = true;

    this.http.post<any>('http://localhost:3000/api/auth/register', payload).subscribe({
      next: () => {
        this.isLoading = false;
        toast.success('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Registration failed. Please try again.';
        this.isLoading = false;
        toast.error('Registration failed. Please try again.');
      }
    });
  }
}