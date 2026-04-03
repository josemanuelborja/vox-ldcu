import { Component, ElementRef, QueryList, ViewChildren, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resetotp',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reset-otp.component.html',
  styleUrls: ['./reset-otp.component.scss']
})
export class ResetOtpComponent implements OnInit, OnDestroy {

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  errorMessage = '';
  countdown = 0;
  canResend = true;
  timer: any;

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
  
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  startCountdown() {
    this.countdown = 180;
    this.canResend = false;

    this.timer = setInterval(() => {
      this.countdown--;
      this.cdr.detectChanges();

      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.canResend = true;
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  getCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  onInput(event: any, index: number) {
    const value = event.target.value;
    if (value && index < 3) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = this.otpInputs.toArray()[index].nativeElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  onResend() {
    if (!this.canResend) return;

    const email = localStorage.getItem('resetEmail');
    if (!email) return;

    this.http.post<any>('http://localhost:3000/api/otp/send', { email }).subscribe({
      next: () => {
        this.startCountdown();
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Failed to resend code.';
      }
    });
  }

  onConfirm() {
    const email = localStorage.getItem('resetEmail');

    const code = this.otpInputs.toArray()
      .map(input => input.nativeElement.value)
      .join('');

    if (code.length < 4) {
      this.errorMessage = 'Please enter the 4-digit code.';
      return;
    }

    this.http.post<any>('http://localhost:3000/api/otp/verify', { email, code }).subscribe({
      next: () => this.router.navigate(['/resetPassword']),
      error: (err) => {
        this.errorMessage = err.error.message || 'Invalid or expired code.'; // ✅ Show validation
      }
    });
  }
}