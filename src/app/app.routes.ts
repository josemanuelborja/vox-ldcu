import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { RegisterComponent } from './Register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TicketComponent } from './Ticket/ticket.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },  // ← Default Login Page nako 
  { path: 'login', component: LoginComponent },  // ← Login 
  { path: 'register', component: RegisterComponent }, // ← Register
  { path: 'dashboard', component: DashboardComponent }, // ← Dashboard
  { path: 'ticket', component: TicketComponent }, // ←  (Ticket)
];