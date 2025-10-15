import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  validateTask(task: any): Observable<ValidationResult> {
    const errors: ValidationError[] = [];

    // Title validation
    if (!task.title || task.title.trim().length === 0) {
      errors.push({
        field: 'title',
        message: 'Title is required',
        code: 'REQUIRED'
      });
    } else if (task.title.length > 100) {
      errors.push({
        field: 'title',
        message: 'Title must be less than 100 characters',
        code: 'MAX_LENGTH'
      });
    } else if (this.containsXSS(task.title)) {
      errors.push({
        field: 'title',
        message: 'Title contains invalid characters',
        code: 'XSS_DETECTED'
      });
    }

    // Description validation
    if (task.description && task.description.length > 500) {
      errors.push({
        field: 'description',
        message: 'Description must be less than 500 characters',
        code: 'MAX_LENGTH'
      });
    } else if (task.description && this.containsXSS(task.description)) {
      errors.push({
        field: 'description',
        message: 'Description contains invalid characters',
        code: 'XSS_DETECTED'
      });
    }

    // Due date validation
    if (!task.dueDate) {
      errors.push({
        field: 'dueDate',
        message: 'Due date is required',
        code: 'REQUIRED'
      });
    } else {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(dueDate.getTime())) {
        errors.push({
          field: 'dueDate',
          message: 'Invalid date format',
          code: 'INVALID_DATE'
        });
      } else if (dueDate < today) {
        errors.push({
          field: 'dueDate',
          message: 'Due date cannot be in the past',
          code: 'PAST_DATE'
        });
      }
    }

    // Priority validation
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!task.priority || !validPriorities.includes(task.priority)) {
      errors.push({
        field: 'priority',
        message: 'Priority must be one of: low, medium, high, urgent',
        code: 'INVALID_VALUE'
      });
    }

    // Status validation (for updates)
    if (task.status !== undefined) {
      const validStatuses = ['not_started', 'in_progress', 'completed'];
      if (!validStatuses.includes(task.status)) {
        errors.push({
          field: 'status',
          message: 'Status must be one of: not_started, in_progress, completed',
          code: 'INVALID_VALUE'
        });
      }
    }

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors
    };

    return of(result);
  }

  validateProject(project: any): Observable<ValidationResult> {
    const errors: ValidationError[] = [];

    // Name validation
    if (!project.name || project.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Project name is required',
        code: 'REQUIRED'
      });
    } else if (project.name.length > 100) {
      errors.push({
        field: 'name',
        message: 'Project name must be less than 100 characters',
        code: 'MAX_LENGTH'
      });
    } else if (this.containsXSS(project.name)) {
      errors.push({
        field: 'name',
        message: 'Project name contains invalid characters',
        code: 'XSS_DETECTED'
      });
    }

    // Description validation
    if (project.description && project.description.length > 500) {
      errors.push({
        field: 'description',
        message: 'Description must be less than 500 characters',
        code: 'MAX_LENGTH'
      });
    } else if (project.description && this.containsXSS(project.description)) {
      errors.push({
        field: 'description',
        message: 'Description contains invalid characters',
        code: 'XSS_DETECTED'
      });
    }

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors
    };

    return of(result);
  }

  validateUser(user: any): Observable<ValidationResult> {
    const errors: ValidationError[] = [];

    // Username validation
    if (!user.username || user.username.trim().length === 0) {
      errors.push({
        field: 'username',
        message: 'Username is required',
        code: 'REQUIRED'
      });
    } else if (user.username.length < 3) {
      errors.push({
        field: 'username',
        message: 'Username must be at least 3 characters long',
        code: 'MIN_LENGTH'
      });
    } else if (user.username.length > 20) {
      errors.push({
        field: 'username',
        message: 'Username must be less than 20 characters',
        code: 'MAX_LENGTH'
      });
    } else if (!/^[a-zA-Z0-9_-]+$/.test(user.username)) {
      errors.push({
        field: 'username',
        message: 'Username can only contain letters, numbers, underscores, and hyphens',
        code: 'INVALID_FORMAT'
      });
    }

    // Email validation
    if (user.email) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(user.email)) {
        errors.push({
          field: 'email',
          message: 'Invalid email format',
          code: 'INVALID_EMAIL'
        });
      }
    }

    // Password validation
    if (user.password) {
      if (user.password.length < 8) {
        errors.push({
          field: 'password',
          message: 'Password must be at least 8 characters long',
          code: 'MIN_LENGTH'
        });
      }

      if (!/[A-Z]/.test(user.password)) {
        errors.push({
          field: 'password',
          message: 'Password must contain at least one uppercase letter',
          code: 'PASSWORD_REQUIREMENT'
        });
      }

      if (!/[a-z]/.test(user.password)) {
        errors.push({
          field: 'password',
          message: 'Password must contain at least one lowercase letter',
          code: 'PASSWORD_REQUIREMENT'
        });
      }

      if (!/\d/.test(user.password)) {
        errors.push({
          field: 'password',
          message: 'Password must contain at least one number',
          code: 'PASSWORD_REQUIREMENT'
        });
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(user.password)) {
        errors.push({
          field: 'password',
          message: 'Password must contain at least one special character',
          code: 'PASSWORD_REQUIREMENT'
        });
      }
    }

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors
    };

    return of(result);
  }

  private containsXSS(text: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /<link/gi,
      /<meta/gi,
      /expression\s*\(/gi,
      /vbscript:/gi,
      /data:text\/html/gi
    ];

    return xssPatterns.some(pattern => pattern.test(text));
  }

  formatValidationErrors(errors: ValidationError[]): string {
    return errors.map(error => `${error.field}: ${error.message}`).join('\n');
  }
}
