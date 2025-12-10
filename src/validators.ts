import type {
  FormValidator,
  FieldValidator,
  StringValidator,
  NumberValidator,
  ArrayValidator,
} from './types/types';

export class FormInputValidator {
  private form: HTMLFormElement;
  private inputs: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] = [];

  constructor(form: HTMLFormElement) {
    this.form = form;
    this.collectInputs();
  }

  private collectInputs(): void {
    const inputElements = this.form.querySelectorAll('input, textarea, select');
    this.inputs = Array.from(inputElements).filter(
      (el): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
    );
  }

  hasInputs(): boolean {
    return this.inputs.length > 0;
  }

  getInputCount(): number {
    return this.inputs.length;
  }

  getInputs() {
    return this.inputs;
  }

  hasInputByName(name: string): boolean {
    return this.inputs.some(input => input.name === name);
  }

  hasInputById(id: string): boolean {
    return this.inputs.some(input => input.id === id);
  }

  getInputByName(name: string) {
    return this.inputs.find(input => input.name === name) ?? null;
  }

  getInputById(id: string) {
    return this.inputs.find(input => input.id === id) ?? null;
  }

  getInputsByType(type: string) {
    return this.inputs.filter(
      input => input instanceof HTMLInputElement && input.type === type
    );
  }

  hasRequiredInputs(): boolean {
    return this.inputs.some(input => input.required);
  }

  getRequiredInputs() {
    return this.inputs.filter(input => input.required);
  }

  validateAllInputsHaveNames(): boolean {
    return this.inputs.every(input => input.name && input.name.trim() !== '');
  }
}

export function KatyshFormValidator(formElement: HTMLFormElement): FormValidator {
  const formValidator = new FormInputValidator(formElement);
  const validationRules: Map<string, Array<() => boolean>> = new Map();

  if (!formValidator.hasInputs()) {
    throw new Error('Form has no inputs');
  }

  if (!formValidator.validateAllInputsHaveNames()) {
    throw new Error('Not all inputs have name attribute');
  }

  return {
    field(fieldName: string): FieldValidator {
      const element = formValidator.getInputByName(fieldName);
      if (!element) {
        throw new Error(`Field "${fieldName}" not found`);
      }

      if (element instanceof HTMLInputElement && !validateLabelBinding(element)) {
        throw new Error(`Field "${fieldName}" has no label binding`);
      }

      const errorValidator = new ErrorFieldValidator(element as HTMLInputElement, formElement);
      if (!errorValidator.hasErrorField()) {
        throw new Error(`Field "${fieldName}" has no error field`);
      }

      if (!validationRules.has(fieldName)) {
        validationRules.set(fieldName, []);
      }

      return {
        string(): StringValidator {
          const validator: StringValidator = {
            min(message: string) {
              validationRules.get(fieldName)!.push(() => {
                const value = (element as HTMLInputElement).value;
                const minLength = parseInt(message.match(/\d+/)?.[0] || '0');
                if (value.length < minLength) {
                  errorValidator.setErrorMessage(message);
                  return false;
                }
                errorValidator.clearErrorMessage();
                return true;
              });
              return validator;
            },
            max(message: string) {
              validationRules.get(fieldName)!.push(() => {
                const value = (element as HTMLInputElement).value;
                const maxLength = parseInt(message.match(/\d+/)?.[0] || '999');
                if (value.length > maxLength) {
                  errorValidator.setErrorMessage(message);
                  return false;
                }
                errorValidator.clearErrorMessage();
                return true;
              });
              return validator;
            },
            pattern(pattern: RegExp, message: string) {
              validationRules.get(fieldName)!.push(() => {
                const value = (element as HTMLInputElement).value;
                if (!pattern.test(value)) {
                  errorValidator.setErrorMessage(message);
                  return false;
                }
                errorValidator.clearErrorMessage();
                return true;
              });
              return validator;
            },
            label(_message: string) {
              return validator;
            },
          };
          return validator;
        },

        number(): NumberValidator {
          const validator: NumberValidator = {
            min(message: string) {
              validationRules.get(fieldName)!.push(() => {
                const value = parseFloat((element as HTMLInputElement).value);
                const minValue = parseFloat(message.match(/\d+/)?.[0] || '0');
                if (isNaN(value) || value < minValue) {
                  errorValidator.setErrorMessage(message);
                  return false;
                }
                errorValidator.clearErrorMessage();
                return true;
              });
              return validator;
            },
            max(message: string) {
              validationRules.get(fieldName)!.push(() => {
                const value = parseFloat((element as HTMLInputElement).value);
                const maxValue = parseFloat(message.match(/\d+/)?.[0] || '999999');
                if (isNaN(value) || value > maxValue) {
                  errorValidator.setErrorMessage(message);
                  return false;
                }
                errorValidator.clearErrorMessage();
                return true;
              });
              return validator;
            },
            label(_message: string) {
              return validator;
            },
          };
          return validator;
        },

        array(): ArrayValidator {
          const validator: ArrayValidator = {
            min(message: string) {
              validationRules.get(fieldName)!.push(() => {
                const checkedCount = formValidator
                  .getInputsByType('checkbox')
                  .filter(input => input.name === fieldName && (input as HTMLInputElement).checked).length;
                const minCount = parseInt(message.match(/\d+/)?.[0] || '0');
                if (checkedCount < minCount) {
                  errorValidator.setErrorMessage(message);
                  return false;
                }
                errorValidator.clearErrorMessage();
                return true;
              });
              return validator;
            },
            max(message: string) {
              validationRules.get(fieldName)!.push(() => {
                const checkedCount = formValidator
                  .getInputsByType('checkbox')
                  .filter(input => input.name === fieldName && (input as HTMLInputElement).checked).length;
                const maxCount = parseInt(message.match(/\d+/)?.[0] || '999');
                if (checkedCount > maxCount) {
                  errorValidator.setErrorMessage(message);
                  return false;
                }
                errorValidator.clearErrorMessage();
                return true;
              });
              return validator;
            },
            label(_message: string) {
              return validator;
            },
          };
          return validator;
        },
      };
    },

    validate(): boolean {
      if (!formValidator.hasInputs()) {
        return false;
      }

      if (!formValidator.validateAllInputsHaveNames()) {
        return false;
      }

      let isValid = true;

      for (const [_fieldName, rules] of validationRules) {
        for (const rule of rules) {
          if (!rule()) {
            isValid = false;
          }
        }
      }

      return isValid;
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
  private formValidator: FormInputValidator | null = null;

  constructor(input: HTMLInputElement, form?: HTMLFormElement) {
    this.input = input;

    if (form) {
      this.formValidator = new FormInputValidator(form);

      if (this.input.name && !this.formValidator.hasInputByName(this.input.name)) {
        throw new Error(`Input with name "${this.input.name}" not found in form`);
      }
    }
  }

  hasErrorField(): boolean {
    const nextElement = this.input.nextElementSibling;
    if (
      nextElement &&
      (nextElement.classList.contains('error') ||
        nextElement.classList.contains('error-message'))
    ) {
      this.errorElement = nextElement as HTMLElement;
      return true;
    }
    return false;
  }

  getErrorElement(): HTMLElement | null {
    return this.errorElement;
  }

  setErrorMessage(message: string): boolean {
    if (this.formValidator && this.input.name) {
      const inputExists = this.formValidator.hasInputByName(this.input.name);
      if (!inputExists) {
        return false;
      }
    }

    if (this.hasErrorField() && this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.style.display = 'block';
      return true;
    }
    return false;
  }

  clearErrorMessage(): boolean {
    if (this.formValidator && this.input.name) {
      const inputExists = this.formValidator.hasInputByName(this.input.name);
      if (!inputExists) {
        return false;
      }
    }

    if (this.errorElement) {
      this.errorElement.textContent = '';
      this.errorElement.style.display = 'none';
      return true;
    }
    return false;
  }
}
