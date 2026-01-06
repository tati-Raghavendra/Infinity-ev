import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdminLoginComponent {
  loginSuccess = output<void>();
  
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  error = signal<string | null>(null);
  isLoading = signal(false);

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    // Simulate network delay for "security check" effect
    setTimeout(() => {
      const { username, password } = this.loginForm.getRawValue();

      // Demo Credentials
      if (username === 'admin' && password === 'infinity') {
        this.loginSuccess.emit();
      } else {
        this.error.set('ACCESS DENIED: Invalid Credentials');
        this.loginForm.get('password')?.reset();
      }
      this.isLoading.set(false);
    }, 800);
  }
}