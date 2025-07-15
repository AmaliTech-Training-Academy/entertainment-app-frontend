import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  registerForm: FormGroup;
  private registeredUsers = [
    { username: 'ernesto', email: 'ernesto@example.com' },
    { username: 'cineversefan', email: 'fan@cineverse.com' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.registerForm = this.fb.group(
      {
        username: [
          '',
          [Validators.required, Validators.minLength(3)],
          [this.usernameTakenValidator],
        ],
        email: [
          '',
          [Validators.required, Validators.email],
          [this.emailTakenValidator],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.strongPasswordValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  // Add this method inside the SignUpComponent class
  private strongPasswordValidator(control: any): ValidationErrors | null {
    const value = control.value;
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    return strongPasswordRegex.test(value) ? null : { weakPassword: true };
  }

  // Validator for username taken
  usernameTakenValidator = (control: any): Promise<ValidationErrors | null> => {
    return new Promise((resolve) => {
      const exists = this.registeredUsers.some(
        (user) => user.username === control.value,
      );
      setTimeout(() => resolve(exists ? { usernameTaken: true } : null), 500);
    });
  };

  // Validator for email taken
  emailTakenValidator = (control: any): Promise<ValidationErrors | null> => {
    return new Promise((resolve) => {
      const exists = this.registeredUsers.some(
        (user) => user.email === control.value,
      );
      setTimeout(() => resolve(exists ? { emailTaken: true } : null), 500);
    });
  };

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      this.authService.register({ username, email, password }).subscribe({
        next: (response) => {
          console.log('Registered successfully:', response);
          // Redirect to login or dashboard
        },
        error: (error) => {
          console.error('Registration error:', error);
          if (error.error?.message === 'Username already taken') {
            this.username?.setErrors({ usernameTaken: true });
          }
          if (error.error?.message === 'Email already registered') {
            this.email?.setErrors({ emailTaken: true });
          }
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get passwordMismatch(): boolean {
    return (
      !!this.confirmPassword?.touched &&
      this.registerForm.hasError('passwordMismatch')
    );
  }
}
