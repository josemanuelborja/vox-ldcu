import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  fullName: string = '';
  studentId: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  onRegister() {

    if (!this.fullName || !this.studentId || !this.email || !this.password) {
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

    this.errorMessage = '';
    alert('Registration successful! You can now login.');
  }
}