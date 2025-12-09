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




export class FormInputValidator {
  private form: HTMLFormElement;
  private inputs: HTMLInputElement[] = [];

  constructor(form: HTMLFormElement) {
    this.form = form;
    this.collectInputs();
  }

  private collectInputs(): void {
    const inputElements = this.form.querySelectorAll('input, textarea, select');
    this.inputs = Array.from(inputElements).filter(
      (el): el is HTMLInputElement => el instanceof HTMLInputElement ||
                                        el instanceof HTMLTextAreaElement ||
                                        el instanceof HTMLSelectElement
    ) as HTMLInputElement[];
  }

  hasInputs(): boolean {
    return this.inputs.length > 0;
  }

  getInputCount(): number {
    return this.inputs.length;
  }

  getInputs(): HTMLInputElement[] {
    return this.inputs;
  }

  hasInputByName(name: string): boolean {
    return this.inputs.some(input => input.name === name);
  }

  hasInputById(id: string): boolean {
    return this.inputs.some(input => input.id === id);
  }

  getInputByName(name: string): HTMLInputElement | null {
    return this.inputs.find(input => input.name === name) || null;
  }

  getInputById(id: string): HTMLInputElement | null {
    return this.inputs.find(input => input.id === id) || null;
  }

  getInputsByType(type: string): HTMLInputElement[] {
    return this.inputs.filter(input => input.type === type);
  }

  hasRequiredInputs(): boolean {
    return this.inputs.some(input => input.required);
  }

  getRequiredInputs(): HTMLInputElement[] {
    return this.inputs.filter(input => input.required);
  }

  validateAllInputsHaveNames(): boolean {
    return this.inputs.every(input => input.name && input.name.trim() !== '');
  }
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