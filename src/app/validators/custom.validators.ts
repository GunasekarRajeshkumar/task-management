import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  
  // XSS Prevention Validator
  static noXSS(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toString();
      
      // Check for common XSS patterns
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
      
      for (const pattern of xssPatterns) {
        if (pattern.test(value)) {
          return { xssDetected: { value: control.value } };
        }
      }
      
      return null;
    };
  }
  
  // Strong Password Validator
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const password = control.value;
      const errors: ValidationErrors = {};
      
      if (password.length < 8) {
        errors['minLength'] = true;
      }
      
      if (!/[A-Z]/.test(password)) {
        errors['noUppercase'] = true;
      }
      
      if (!/[a-z]/.test(password)) {
        errors['noLowercase'] = true;
      }
      
      if (!/\d/.test(password)) {
        errors['noNumber'] = true;
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors['noSpecialChar'] = true;
      }
      
      return Object.keys(errors).length > 0 ? errors : null;
    };
  }
  
  // Email Validator
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (!emailPattern.test(control.value)) {
        return { invalidEmail: true };
      }
      
      return null;
    };
  }
  
  // Username Validator
  static username(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const username = control.value;
      
      if (username.length < 3) {
        return { minLength: true };
      }
      
      if (username.length > 20) {
        return { maxLength: true };
      }
      
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return { invalidCharacters: true };
      }
      
      return null;
    };
  }
  
  // Date Validator (not in past for due dates)
  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return { pastDate: true };
      }
      
      return null;
    };
  }
  
  // File Size Validator (for future file upload features)
  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value;
      if (file && file.size > maxSizeInMB * 1024 * 1024) {
        return { fileSizeExceeded: { maxSize: maxSizeInMB, actualSize: file.size } };
      }
      
      return null;
    };
  }
  
  // File Type Validator (for future file upload features)
  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value;
      if (file && !allowedTypes.includes(file.type)) {
        return { invalidFileType: { allowedTypes, actualType: file.type } };
      }
      
      return null;
    };
  }
}
