import { Component, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

interface RegisterResponse {
  token?: string;
  message?: string;
}

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
    MatSnackBarModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  step = 1;

  registerForm: FormGroup;
  loading = false;
  apiError: string | null = null;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email], [this.emailTakenValidator]],
        username: [{ value: '', disabled: true }, [Validators.required]],
        password: [
          '',
          [Validators.required, Validators.minLength(8), this.strongPasswordValidator],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  nextStep(): void {
    if (this.firstName?.valid && this.lastName?.valid && this.email?.valid) {
      // No need to generate username, just proceed
      this.step = 2;
    } else {
      this.firstName?.markAsTouched();
      this.lastName?.markAsTouched();
      this.email?.markAsTouched();
    }
  }

  createAccount(): void {
    this.apiError = null;
    if (this.registerForm.valid) {
      this.loading = true;
      const formValue = {
        firstName: this.firstName?.value,
        lastName: this.lastName?.value,
        email: this.email?.value,
        password: this.password?.value,
        // Add other fields if required by backend
      };
      this.authService.register(formValue).subscribe({
        next: (res: unknown) => {
          const response = res as RegisterResponse;
          this.loading = false;
          // Store token in cookies if returned
          if (response.token) {
            document.cookie = `token=${response.token}; path=/; SameSite=None; Secure`;
          }

          this.snackBar.open('Account created successfully!', 'Close', {
            duration: 10000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });

          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          if (err.error?.message) {
            this.apiError = err.error.message;

            // Check for email taken error
            if (err.error.message.toLowerCase().includes('email')) {
              this.snackBar.open('Email already taken ❌', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              });
            } else {
              this.snackBar.open(this.apiError ?? 'An unexpected error occurred.', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              });
            }
          } else {
            this.apiError = 'Registration failed. Please try again.';
            this.snackBar.open(this.apiError, 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            });
          }
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  private strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(value) ? null : { weakPassword: true };
  }

  emailTakenValidator = (control: AbstractControl): Promise<ValidationErrors | null> => {
    return new Promise((resolve) => {
      const fakeEmails = ['ernesto@example.com', 'fan@cineverse.com'];
      const exists = fakeEmails.includes(control.value);
      setTimeout(() => resolve(exists ? { emailTaken: true } : null), 500);
    });
  };

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Getters
  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get username() {
    return this.registerForm.get('username');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get passwordMismatch(): boolean {
    return !!this.confirmPassword?.touched && this.registerForm.hasError('passwordMismatch');
  }
}
