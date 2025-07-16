import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://your-api-base-url.com/api'; // Replace with actual backend URL

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<any> {
  const fakeResponse = {
    token: 'mock-jwt-token-12345',
    user: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: 'user',
    }
  };

  return of(fakeResponse).pipe(delay(1000)); 
}


  generateUsername(firstName: string, lastName: string): Observable<string> {
  const username = `${firstName}.${lastName}`.toLowerCase();
  return of(username).pipe(delay(500)); // simulate backend delay
}

}
