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
  isLoading = false;

   constructor(private router: Router, private http: HttpClient) {}

  onRegister() {

    if (!this.fullName || !this.studentId || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (!this.email.includes('@liceo.edu.ph')) {
      this.errorMessage = 'Please use your school email (@liceo.edu.ph).';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    
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