import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: any;
  loginError = '';
  // Sample user
  private readonly sampleUser = {
    email: 'test@example.com',
    password: 'password123',
    avatar: 'assets/images/cineverse_logo.svg', // You can use any avatar image
    name: 'Test User',
  };
  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: [
        '',
        Validators.required,
        // Validators.pattern(
        //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        // ),
      ],
    });
  }

  onSubmit() {
    this.loginError = '';
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (
        username === this.sampleUser.email &&
        password === this.sampleUser.password
      ) {
        // Store a sample token and user info in localStorage
        localStorage.setItem('auth_token', 'sample_token_123');
        localStorage.setItem(
          'auth_user',
          JSON.stringify({
            email: this.sampleUser.email,
            name: this.sampleUser.name,
            avatar: this.sampleUser.avatar,
          })
        );
        this.router.navigate(['']);
      } else {
        this.loginError = 'Invalid email or password.';
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
