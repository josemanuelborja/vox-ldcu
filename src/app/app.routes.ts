import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { RegisterComponent } from './Register/register.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },  // ← Default Login Page nako 
  { path: 'login', component: LoginComponent },  // ← Login 
  { path: 'register', component: RegisterComponent }, // ← Register
];