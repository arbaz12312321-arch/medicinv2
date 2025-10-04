export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [field: string]: ValidationRule;
}

class FormValidation {
  static validateField(value: any, rules: ValidationRule): string | null {
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'This field is required';
    }

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters`;
    }

    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }

  static validateForm(data: any, rules: ValidationRules): Record<string, string> {
    const errors: Record<string, string> = {};

    Object.keys(rules).forEach(field => {
      const value = this.getNestedValue(data, field);
      const error = this.validateField(value, rules[field]);
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  }

  static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  static patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\-\+\(\)]+$/,
    strength: /^\d+(\.\d+)?\s*(mg|g|ml|mcg|iu)$/i,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    numeric: /^\d+$/,
    decimal: /^\d+(\.\d+)?$/
  };

  static rules = {
    required: { required: true },
    email: { pattern: this.patterns.email },
    phone: { pattern: this.patterns.phone },
    strength: { pattern: this.patterns.strength },
    medicineName: {
      required: true,
      minLength: 2,
      custom: (value: string) => {
        if (value && /^\d+$/.test(value)) {
          return 'Medicine name cannot be only numbers';
        }
        return null;
      }
    },
    brandName: { required: true, minLength: 1 },
    strengthRequired: {
      required: true,
      pattern: this.patterns.strength,
      custom: (value: string) => {
        if (value && !this.patterns.strength.test(value)) {
          return 'Please enter valid strength (e.g., 500mg, 10ml)';
        }
        return null;
      }
    }
  };
}

export default FormValidation;
