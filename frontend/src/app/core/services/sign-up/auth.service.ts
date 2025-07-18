import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // Add other fields if required by your backend
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}



  register(payload: RegisterPayload): Observable<any> {
    console.log(payload)
    return this.http.post(`https://d101mapcha7bof.cloudfront.net/api/v1/auth/register`, payload);
  }

  // You can add other API methods here (login, etc.)
}
