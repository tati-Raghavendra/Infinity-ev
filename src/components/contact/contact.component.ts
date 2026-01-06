import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
// FIX: Removed FormBuilder and inject() and used FormGroup/FormControl directly to avoid DI issues.
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule]
})
export class ContactComponent {
  currentYear = new Date().getFullYear();
  contactService = inject(ContactService);

  // FIX: Replaced FormBuilder.group with new FormGroup to fix 'group does not exist on type unknown' error.
  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  submitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  get name(): FormControl<string> {
    return this.contactForm.get('name') as FormControl<string>;
  }

  get email(): FormControl<string> {
    return this.contactForm.get('email') as FormControl<string>;
  }

  get message(): FormControl<string> {
    return this.contactForm.get('message') as FormControl<string>;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const formData = this.contactForm.getRawValue();

    this.contactService.sendContactForm({
      name: formData.name!,
      email: formData.email!,
      message: formData.message!
    })
    .pipe(finalize(() => this.submitting.set(false)))
    .subscribe({
      next: () => {
        this.successMessage.set('Thank you for your message! We will get back to you soon.');
        this.contactForm.reset();
      },
      error: () => {
        this.errorMessage.set('An unexpected error occurred. Please try again later.');
      }
    });
  }
}
