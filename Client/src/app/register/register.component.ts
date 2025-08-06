import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,NgIf ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  loader:Boolean=false

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/)],
        ],
        confirmPassword: ['', Validators.required],
        gender: ['', Validators.required],
        phone: ['', Validators.required],
        dateOfBirth: ['', Validators.required], // always required
        specialization: [''],
        role: ['patient', Validators.required],
      },
      {
        validators: this.passwordsMatchValidator('password', 'confirmPassword'),
      }
    );

    // Re-validate dynamically based on role selection
    this.registerForm.get('role')?.valueChanges.subscribe((role) => {
      const specialization = this.registerForm.get('specialization');
      if (role === 'doctor') {
        specialization?.setValidators([Validators.required]);
      } else {
        specialization?.clearValidators();
      }
      specialization?.updateValueAndValidity();
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  private passwordsMatchValidator(passwordKey: string, confirmKey: string): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const password = group.get(passwordKey)?.value;
      const confirm = group.get(confirmKey)?.value;
      return password === confirm ? null : { passwordMismatch: true };
    };
  }

  onSubmit(): void {

    this.submitted = true;
    if (this.registerForm.valid) {
        this.loader=true
      const formData = this.registerForm.value;
      const role = formData.role;

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        image:"https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        ...(role === 'doctor' && { specialization: formData.specialization }),
      };

      const request$ =
        role === 'doctor'
          ? this.auth.signupDoctor(payload)
          : this.auth.signupPatient(payload);


      request$.subscribe({
        next: () => {
              this.auth.login({
      email: formData.email,
      password: formData.password,
      role:"patient"}).subscribe({
      next: () => {
        const userRole = this.auth.getRole();
        if (userRole === 'admin') this.router.navigate(['/admin']);
        else if (userRole === 'doctor') this.router.navigate(['/doctors']);
        else this.router.navigate(['/']);
        this.loader=false
      },
      error: (err) => {
        const errorMsg = err?.error?.message || err?.message || 'Login failed';
        alert(errorMsg);
         this.loader=false
      }
    })
        },
        error: (err) => alert(err.error.message || 'Registration failed'),
      });
    }
  }
}
