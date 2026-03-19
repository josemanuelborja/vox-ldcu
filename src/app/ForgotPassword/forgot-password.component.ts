import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  
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
    alert('Reset Password sent to ' + this.email);

  }


  onCancel() {
    this.router.navigate(['/login']);
  }
}