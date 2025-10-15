import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userMessage: string;
}

export interface ErrorLog {
  id: string;
  error: AppError;
  url?: string;
  userId?: string;
  userAgent?: string;
  stackTrace?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  private errorLogs: ErrorLog[] = [];

  constructor() { }

  handleError(error: any): Observable<never> {
    const appError = this.createAppError(error);
    this.logError(appError, error);
    
    return throwError(() => appError);
  }

  handleValidationError(errors: any[]): Observable<never> {
    const appError: AppError = {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: errors,
      timestamp: new Date(),
      userMessage: 'Please check your input and try again'
    };

    this.logError(appError);
    return throwError(() => appError);
  }

  handleNetworkError(error: HttpErrorResponse): Observable<never> {
    let appError: AppError;

    switch (error.status) {
      case 400:
        appError = {
          code: 'BAD_REQUEST',
          message: 'Invalid request',
          details: error.error,
          timestamp: new Date(),
          userMessage: 'The request was invalid. Please check your input.'
        };
        break;
      case 401:
        appError = {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          details: error.error,
          timestamp: new Date(),
          userMessage: 'Please log in to continue.'
        };
        break;
      case 403:
        appError = {
          code: 'FORBIDDEN',
          message: 'Access denied',
          details: error.error,
          timestamp: new Date(),
          userMessage: 'You do not have permission to perform this action.'
        };
        break;
      case 404:
        appError = {
          code: 'NOT_FOUND',
          message: 'Resource not found',
          details: error.error,
          timestamp: new Date(),
          userMessage: 'The requested resource was not found.'
        };
        break;
      case 409:
        appError = {
          code: 'CONFLICT',
          message: 'Resource conflict',
          details: error.error,
          timestamp: new Date(),
          userMessage: 'This resource already exists or conflicts with existing data.'
        };
        break;
      case 422:
        appError = {
          code: 'UNPROCESSABLE_ENTITY',
          message: 'Validation failed',
          details: error.error,
          timestamp: new Date(),
          userMessage: 'The data provided is invalid.'
        };
        break;
      case 429:
        appError = {
          code: 'RATE_LIMITED',
          message: 'Too many requests',
          details: error.error,
          timestamp: new Date(),
          userMessage: 'Too many requests. Please wait a moment and try again.'
        };
        break;
      case 500:
        appError = {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Server error',
          details: error.error,
          timestamp: new Date(),
          userMessage: 'Something went wrong on our end. Please try again later.'
        };
        break;
      case 503:
        appError = {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Service unavailable',
          details: error.error,
          timestamp: new Date(),
          userMessage: 'The service is temporarily unavailable. Please try again later.'
        };
        break;
      default:
        if (error.status === 0) {
          appError = {
            code: 'NETWORK_ERROR',
            message: 'Network error',
            details: error,
            timestamp: new Date(),
            userMessage: 'Unable to connect to the server. Please check your internet connection.'
          };
        } else {
          appError = {
            code: 'UNKNOWN_ERROR',
            message: 'Unknown error occurred',
            details: error,
            timestamp: new Date(),
            userMessage: 'An unexpected error occurred. Please try again.'
          };
        }
    }

    this.logError(appError, error);
    return throwError(() => appError);
  }

  private createAppError(error: any): AppError {
    if (error instanceof HttpErrorResponse) {
      return this.handleNetworkError(error) as any;
    }

    if (error.name === 'ValidationError') {
      return {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: error.details,
        timestamp: new Date(),
        userMessage: 'Please check your input and try again'
      };
    }

    if (error.name === 'SecurityError') {
      return {
        code: 'SECURITY_ERROR',
        message: error.message,
        details: error,
        timestamp: new Date(),
        userMessage: 'A security error occurred. Please try again.'
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: error,
      timestamp: new Date(),
      userMessage: 'An unexpected error occurred. Please try again.'
    };
  }

  private logError(appError: AppError, originalError?: any): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      error: appError,
      url: window.location.href,
      userAgent: navigator.userAgent,
      stackTrace: originalError?.stack
    };

    this.errorLogs.push(errorLog);
    
    // In a real application, you would send this to a logging service
    console.error('Application Error:', errorLog);
    
    // Store in localStorage for debugging (in development)
    if (!environment.production) {
      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingLogs.push(errorLog);
      localStorage.setItem('errorLogs', JSON.stringify(existingLogs.slice(-50))); // Keep last 50 errors
    }
  }

  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  clearErrorLogs(): void {
    this.errorLogs = [];
    localStorage.removeItem('errorLogs');
  }

  getUserFriendlyMessage(error: AppError): string {
    return error.userMessage;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Mock environment for this demo
const environment = {
  production: false
};
