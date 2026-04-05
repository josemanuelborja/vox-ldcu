import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';
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
  { path: '', component: LoginComponent },  // ← Default Login Page nako 
  { path: 'login', component: LoginComponent },  // ← Login 
  { path: 'register', component: RegisterComponent }, // ← Register
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }, // ← Dashboard
  { path: 'ticket', component: TicketComponent,  canActivate: [authGuard] }, // ←  (Ticket)
  { path: 'forgotPassword', component: ForgotPasswordComponent }, // ←  (Forgot Password)
  { path: 'reportDetails', component: ReportDetailsComponent, canActivate: [authGuard] }, // ←  (Report Details)
  { path: 'adminDashboard', component: AdminComponent, canActivate: [adminGuard] }, // ←  (Admin Dashboard)
  { path: 'ticketDetails', component: TicketDetailsComponent, canActivate: [adminGuard] }, // ← (Ticket Details)
  { path: 'resetOtp', component: ResetOtpComponent }, // ← (Reset OTP)
  { path: 'confirmPassword', component: ConfirmPasswordComponent } // ← (Confirm Password)
];