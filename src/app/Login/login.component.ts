import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  // These variables store what the user types
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading = false;


  constructor(private router: Router, private http: HttpClient) {}

  // kani nga function mo run kung i-click ang login button
  onLogin() {
    // Basic check: make sure ang email and password fields are not empty
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const payload = {
      email: this.email,
      password: this.password
    };

    this.isLoading = true;

    this.http.post<any>('http://localhost:3000/api/auth/login', payload).subscribe({
      next: (res) => {
        localStorage.setItem('user', JSON.stringify(res));

        this.isLoading = false;

        if (res.role === 'admin') {
          this.router.navigate(['/adminDashboard']);
        } else {
          this.router.navigate(['/dashboard']); 
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Invalid email or password.';
        this.isLoading = false;
      }
    });
  }
}