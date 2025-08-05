import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, RouterLink]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  role: 'doctor' | 'patient' | 'admin' = 'patient';
  submitted = false;

  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {
    this.submitted = true;
    if (form.invalid) return;

    const loginData = {
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.auth.login(loginData).subscribe({
      next: () => {
        const userRole = this.auth.getRole();
        if (userRole === 'admin') this.router.navigate(['/admin']);
        else if (userRole === 'doctor') this.router.navigate(['/doctor']);
        else this.router.navigate(['/']);
      },
      error: (err) => {
        const errorMsg = err?.error?.message || err?.message || 'Login failed';
        alert(errorMsg);
      }
    });
  }
}
