import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormField,
    CommonModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: any;
  loginError = '';
  isLoading = false;
  // Sample user

  private readonly sampleUser = {
    email: 'test@example.com',
    password: 'password123',
    avatar: 'assets/images/cineverse_logo.svg', // You can use any avatar image
    name: 'Test User',
  };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/),
        ],
      ],
    });
  }

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      const emailControl = this.loginForm.get('email');
      const passwordControl = this.loginForm.get('password');

      // Username validation
      if (emailControl?.touched || emailControl?.dirty) {
        if (emailControl.hasError('required')) {
          this.loginError = 'Email is required.';
        } else if (emailControl.hasError('email')) {
          this.loginError = 'Please enter a valid email address.';
        } else {
          this.loginError = '';
        }
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.loginError = '';
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          // Extract token and user info from response.data
          const { token, refreshToken, ...user } = response.data || {};
          if (token) {
            document.cookie = `auth_token=${token}; path=/; SameSite=None; Secure`;
          }
          if (refreshToken) {
            document.cookie = `refresh_token=${refreshToken}; path=/; SameSite=None; Secure`;
          }
          if (Object.keys(user).length > 0) {
            document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(user))}; path=/;`;
          }
          this.isLoading = false;
          this.snackBar.open('Login successful!', 'Close', {
            duration: 10000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log('Login error:', err);
          this.isLoading = false;
          this.loginError = err?.error?.message || 'Invalid email or password.';
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
