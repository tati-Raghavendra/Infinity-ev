import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ContactService, ContactMessage } from '../../services/contact.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DatePipe]
})
export class AdminDashboardComponent implements OnInit {
  contactService = inject(ContactService);
  logout = output<void>();

  messages = signal<ContactMessage[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.fetchMessages();
  }

  fetchMessages() {
    this.loading.set(true);
    this.error.set(null); // Clear previous errors
    
    this.contactService.getMessages().subscribe({
      next: (data) => {
        this.messages.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse | Error) => {
        // Fix: Improved logging to avoid [object Object] in text logs
        // Using console.error with spread arguments often helps in browsers, 
        // but explicit message logging is safer for text logs.
        console.error('Error fetching messages:', err);
        
        let errorMessage = 'Unknown error occurred';
        let status: number | string | undefined = undefined;
        
        // Handle HttpErrorResponse (from HTTP client)
        if (err instanceof HttpErrorResponse) {
          status = err.status;
          
          if (err.status === 0) {
            errorMessage = 'Unable to connect to the server. Please ensure the backend is running.';
          } else if (err.error) {
            // Handle Express/Node backend error responses
            if (typeof err.error === 'object') {
              // Check for specific property 'error' which our backend uses
              // Using 'in' operator check or direct property access with type assertion
              const errObj = err.error as any;
              if (errObj.error) {
                errorMessage = errObj.error;
              } else if (errObj.message) {
                errorMessage = errObj.message;
              } else {
                // Fallback for other objects, try to stringify
                try {
                  errorMessage = JSON.stringify(errObj);
                } catch (e) {
                  errorMessage = 'Invalid error object received';
                }
              }
            } else {
              errorMessage = String(err.error);
            }
          } else if (err.message) {
            errorMessage = err.message;
          }
        } else if (err instanceof Error) {
          // Handle regular Error objects (from map operator or other sources)
          errorMessage = err.message || 'An error occurred while processing the response';
        } else {
          // Fallback for any other error type
          errorMessage = String(err);
        }

        const statusText = status !== undefined ? ` (Status: ${status})` : '';
        this.error.set(`System Alert: ${errorMessage}${statusText}`);
        this.loading.set(false);
      }
    });
  }

  refresh() {
    this.fetchMessages();
  }

  onLogout() {
    this.logout.emit();
  }
}