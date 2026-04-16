import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './guards/auth.guard';
import { LoginComponent } from './Login/login.component';
import { RegisterComponent } from './Register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TicketComponent } from './Ticket/ticket.component';
import { ForgotPasswordComponent } from './ForgotPassword/forgot-password.component';
import { ReportDetailsComponent } from './ReportDetails/ReportDetails.component';
import { AdminComponent } from './AdminDashboard/admin.component';
import { TicketDetailsComponent } from './AdminDashboard/TicketDetails/ticket-details.component';
import { ResetOtpComponent } from './ResetOtp/reset-otp.comoponent';
import { ConfirmPasswordComponent } from './ConfirmPassword/confirm-password.component';



export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [guestGuard] }, // ← Default Login Page nako 

  { path: 'login', component: LoginComponent, canActivate: [guestGuard] }, // ← Login 
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },  // ← Register
  { path: 'forgotPassword', component: ForgotPasswordComponent, canActivate: [guestGuard] },
  { path: 'resetOtp', component: ResetOtpComponent, canActivate: [guestGuard] }, // ← (Reset OTP)
  { path: 'confirmPassword', component: ConfirmPasswordComponent, canActivate: [guestGuard] }, // ← (Confirm Password)

  // USER
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }, // ← Dashboard
  { path: 'ticket', component: TicketComponent, canActivate: [authGuard] }, // ←  (Ticket)
  { path: 'reportDetails', component: ReportDetailsComponent, canActivate: [authGuard] }, // ←  (Report Details)

  // ADMIN
  { path: 'adminDashboard', component: AdminComponent, canActivate: [adminGuard] },  // ←  (Admin Dashboard)
  { path: 'ticketDetails', component: TicketDetailsComponent, canActivate: [adminGuard] } // ← (Ticket Details)
];