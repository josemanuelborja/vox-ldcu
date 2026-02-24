import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent }, // ← pansamantala, e change ra nako later ang login component to a register component
];