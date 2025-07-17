import { Component } from '@angular/core';
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
import { AuthService } from '../../../../core/services/auth.service';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  step = 1;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: [
          '',
          [Validators.required, Validators.email],
          [this.emailTakenValidator],
        ],
        username: [{ value: '', disabled: true }, [Validators.required]],
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

  nextStep(): void {
    if (this.firstName?.valid && this.lastName?.valid && this.email?.valid) {
      const { firstName, lastName } = this.registerForm.value;

      // Simulate backend username generation
      this.authService.generateUsername(firstName, lastName).subscribe({
        next: (username: string) => {
          this.registerForm.get('username')?.setValue(username);
          this.step = 2;
        },
        error: () => {
          alert('Could not generate username');
        },
      });
    } else {
      this.firstName?.markAsTouched();
      this.lastName?.markAsTouched();
      this.email?.markAsTouched();
    }
  }

  // createAccount(): void {
  //   if (this.registerForm.valid) {
  //     const formValue = {
  //       ...this.registerForm.getRawValue(), // includes disabled username field
  //     };

  //     this.authService.register(formValue).subscribe({
  //       next: (res) => {
  //         console.log('Registration successful:', res);
  //         this.router.navigate(['/admin']);
  //       },
  //       error: (err) => {
  //         console.error('Registration failed:', err);
  //         if (err.error?.message === 'Email already registered') {
  //           this.email?.setErrors({ emailTaken: true });
  //         }
  //       },
  //     });
  //   } else {
  //     this.registerForm.markAllAsTouched();
  //   }
  // }

  //   createAccount(): void {
  //   if (this.registerForm.valid) {
  //     const formValue = {
  //       ...this.registerForm.getRawValue(),
  //     };

  //     this.authService.register(formValue).subscribe({
  //       next: (res) => {
  //         // Save to localStorage
  //         localStorage.setItem('token', res.token);
  //         localStorage.setItem('user', JSON.stringify(res.user));
  //         localStorage.setItem('role', res.user.role);
  //         console.log('User registered successfully:', res);

  //         // Redirect to home
  //         this.router.navigate(['/home']);
  //       },
  //       error: (err) => {
  //         console.error('Registration failed:', err);
  //         if (err.error?.message === 'Email already registered') {
  //           this.email?.setErrors({ emailTaken: true });
  //         }
  //       },
  //     });
  //   } else {
  //     this.registerForm.markAllAsTouched();
  //   }
  // }

  createAccount(): void {
    if (this.registerForm.valid) {
      const formValue = {
        ...this.registerForm.getRawValue(),
      };

      this.authService.register(formValue).subscribe({
        next: (res) => {
          // Save data to localStorage
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('role', res.user.role);

          console.log('User registered successfully:', res);

          // Redirect to home
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Registration failed:', err);
          if (err.error?.message === 'Email already registered') {
            this.email?.setErrors({ emailTaken: true });
          }
        },
      });
    } else {
      // Mark all fields as touched to trigger validation errors
      this.password?.markAsTouched();
      this.confirmPassword?.markAsTouched();
      this.registerForm.markAllAsTouched();
    }
  }

  private strongPasswordValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const value = control.value;
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(value) ? null : { weakPassword: true };
  }

  emailTakenValidator = (
    control: AbstractControl,
  ): Promise<ValidationErrors | null> => {
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
    return (
      !!this.confirmPassword?.touched &&
      this.registerForm.hasError('passwordMismatch')
    );
  }
}
