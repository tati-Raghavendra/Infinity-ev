import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  submitted_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private http = inject(HttpClient) as HttpClient;
  // API base URL:
  // - In local development (Angular dev server on localhost), use port 3001.
  // - In production (same origin as the deployed site), use a relative /api/contact path.
  private apiUrl: string;

  constructor() {
    const isBrowser = typeof window !== 'undefined';
    const isLocalhost = isBrowser && window.location.hostname === 'localhost';

    if (isLocalhost) {
      this.apiUrl = 'http://localhost:3001/api/contact';
    } else {
      this.apiUrl = '/api/contact';
    }
  }

  sendContactForm(payload: ContactFormPayload): Observable<unknown> {
    // Connects directly to the real backend database.
    return this.http.post(this.apiUrl, payload);
  }

  getMessages(): Observable<ContactMessage[]> {
    // Connects directly to the real backend database to fetch messages.
    // We request text to guard against HTML being returned (e.g., when the backend
    // isn't running and a static index.html is served), then parse JSON manually.
    return this.http.get(this.apiUrl, { responseType: 'text' }).pipe(
      map((raw) => {
        try {
          const parsed = JSON.parse(raw) as { message?: string; data?: ContactMessage[] };
          if (Array.isArray(parsed?.data)) {
            return parsed.data;
          }
          throw new Error('Missing data array in API response');
        } catch (err) {
          // Surface a clear error so the UI can show a meaningful message.
          throw new Error('Backend returned non-JSON content. Is the API running on http://localhost:3001/api/contact?');
        }
      })
    );
  }
}