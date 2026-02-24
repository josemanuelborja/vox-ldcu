import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router'; 

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

  constructor(private router: Router) {}

  // kani nga function mo run kung i-click ang login button
  onLogin() {
    // Basic check: make sure ang email and password fields are not empty
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    // test rani sya kung maka login sucessfully help rani sa gpt
    if (this.email === 'student@liceo.edu.ph' && this.password === 'password123') {
      this.errorMessage = '';
      alert('Login successful!');
    
    } else {
      this.errorMessage = 'Invalid email or password.';
    }
  }
}