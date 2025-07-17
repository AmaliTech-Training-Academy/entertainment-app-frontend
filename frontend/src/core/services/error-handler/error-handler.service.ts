import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface ErrorInfo {
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  userFriendlyMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  /**
   * Handle HTTP errors and return user-friendly messages
   */
  handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorInfo: ErrorInfo = {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      timestamp: new Date(),
      userFriendlyMessage: 'Something went wrong. Please try again later.'
    };

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorInfo = {
        message: error.error.message,
        code: 'CLIENT_ERROR',
        timestamp: new Date(),
        userFriendlyMessage: 'Network error. Please check your connection.'
      };
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorInfo = {
            message: 'Bad Request',
            code: 'BAD_REQUEST',
            details: error.error,
            timestamp: new Date(),
            userFriendlyMessage: 'Invalid request. Please check your input.'
          };
          break;
        case 401:
          errorInfo = {
            message: 'Unauthorized',
            code: 'UNAUTHORIZED',
            timestamp: new Date(),
            userFriendlyMessage: 'Please log in to continue.'
          };
          break;
        case 403:
          errorInfo = {
            message: 'Forbidden',
            code: 'FORBIDDEN',
            timestamp: new Date(),
            userFriendlyMessage: 'You don\'t have permission to perform this action.'
          };
          break;
        case 404:
          errorInfo = {
            message: 'Not Found',
            code: 'NOT_FOUND',
            timestamp: new Date(),
            userFriendlyMessage: 'The requested resource was not found.'
          };
          break;
        case 422:
          errorInfo = {
            message: 'Validation Error',
            code: 'VALIDATION_ERROR',
            details: error.error,
            timestamp: new Date(),
            userFriendlyMessage: 'Please check your input and try again.'
          };
          break;
        case 429:
          errorInfo = {
            message: 'Too Many Requests',
            code: 'RATE_LIMIT',
            timestamp: new Date(),
            userFriendlyMessage: 'Too many requests. Please wait a moment and try again.'
          };
          break;
        case 500:
          errorInfo = {
            message: 'Internal Server Error',
            code: 'SERVER_ERROR',
            timestamp: new Date(),
            userFriendlyMessage: 'Server error. Please try again later.'
          };
          break;
        case 502:
        case 503:
        case 504:
          errorInfo = {
            message: 'Service Unavailable',
            code: 'SERVICE_UNAVAILABLE',
            timestamp: new Date(),
            userFriendlyMessage: 'Service temporarily unavailable. Please try again later.'
          };
          break;
        default:
          errorInfo = {
            message: `HTTP Error ${error.status}`,
            code: `HTTP_${error.status}`,
            details: error.error,
            timestamp: new Date(),
            userFriendlyMessage: 'An unexpected error occurred. Please try again.'
          };
      }
    }
    return throwError(() => errorInfo);
  }

}