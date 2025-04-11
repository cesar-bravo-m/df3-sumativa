import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

    if (value.length < 8) {
      errors['minLength'] = true;
    }

    if (value.length > 32) {
      errors['maxLength'] = true;
    }

    if (!/[A-Za-z]/.test(value)) {
      errors['requireLetter'] = true;
    }

    if (!/[0-9]/.test(value)) {
      errors['requireNumber'] = true;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors['requireSpecialChar'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }
}
