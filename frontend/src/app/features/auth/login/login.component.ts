import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/login/auth.service';

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
      MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: any;
  loginError = '';
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
     private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/,
          ),
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

      // Password validation
      if (passwordControl?.touched || passwordControl?.dirty) {
        if (passwordControl.hasError('required')) {
          this.loginError =
            'Password is required. Password must contain uppercase, lowercase, number, and special character.';
        } else if (passwordControl.hasError('minlength')) {
          this.loginError =
            'Minimum 8 characters required. Password must contain uppercase, lowercase, number, and special character.';
        } else if (passwordControl.hasError('pattern')) {
          this.loginError =
            'Password must contain uppercase, lowercase, number, and special character.';
        }
      }
    });
  }

  onSubmit() {
    this.loginError = '';
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
  console.log('Login response:', response);
  const { token, refreshToken, ...user } = response.data || {};
  if (token) {
    document.cookie = `auth_token=${token}; path=/;`;
  }
  if (Object.keys(user).length > 0) {
    document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(user))}; path=/;`;
  }

  // ✅ Show success toast
  this.snackBar.open('Welcome back! 🎉 Login successful.', 'Close', {
    duration: 3000,
    verticalPosition: 'top',
    panelClass: ['success-snackbar'],
  });

  this.router.navigate(['/']);
},

        error: (err) => {
          console.log('Login error:', err);
          this.loginError = err?.error?.message || 'Invalid email or password.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
