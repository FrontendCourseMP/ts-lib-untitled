import type {
  FormValidator,
  FieldValidator,
  StringValidator,
  NumberValidator,
  ArrayValidator,
} from './types/types';

export function KatyshFormValidator(formElement: HTMLFormElement): FormValidator {
  return {
    field(fieldName: string): FieldValidator {
      const element = formElement.elements.namedItem(fieldName);
      if (!element) {
        throw new Error(`Field "${fieldName}" not found`);
      }

      return {
        string(): StringValidator {
          return {
            min(message: string) { return this; },
            max(message: string) { return this; },
            pattern(pattern: RegExp, message: string) { return this; },
          };
        },

        number(): NumberValidator {
          return {
            min(message: string) { return this; },
            max(message: string) { return this; },
          };
        },

        array(): ArrayValidator {
          return {
            min(message: string) { return this; },
            max(message: string) { return this; },
          };
        },
      };
    },

    validate(): boolean {
      return true;
    },
  };
}

export function validateLabelBinding(input: HTMLInputElement): boolean {
  const inputId = input.id;

  if (inputId) {
    const label = document.querySelector(`label[for="${inputId}"]`);
    if (label) return true;
  }
  

  const parentLabel = input.closest('label');
  if (parentLabel) return true;
  
  return false;
}




export class ErrorFieldValidator {
  private input: HTMLInputElement;
  private errorElement: HTMLElement | null = null;

  constructor(input: HTMLInputElement) {
    this.input = input;
  }

  hasErrorField(): boolean {
    const nextElement = this.input.nextElementSibling;
    if (nextElement && (nextElement.classList.contains('error') || nextElement.classList.contains('error-message'))) {
      this.errorElement = nextElement as HTMLElement;
      return true;
    }
    return false;
  }

  getErrorElement(): HTMLElement | null {
    return this.errorElement;
  }
  setErrorMessage(message: string): boolean {
    if (this.hasErrorField() && this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.style.display = 'block';
      return true;
    }
    return false;
  }

  clearErrorMessage(): boolean {
    if (this.errorElement) {
      this.errorElement.textContent = '';
      this.errorElement.style.display = 'none';
      return true;
    }
    return false;
  }
}