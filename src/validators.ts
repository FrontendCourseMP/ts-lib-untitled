import type {
  FormValidator,
  FieldValidator,
  StringValidator,
  NumberValidator,
  ArrayValidator,
} from './types/types';

function validateLabelBinding(input: HTMLElement): boolean {
  const inputId = input.id;

  if (inputId) {
    const label = document.querySelector(`label[for="${inputId}"]`);
    if (label) return true;
  }

  const parentLabel = input.closest('label');
  if (parentLabel) return true;

  return false;
}

function findErrorElement(input: HTMLElement): HTMLElement | null {
  const nextElement = input.nextElementSibling;
  if (
    nextElement &&
    (nextElement.classList.contains('error') ||
      nextElement.classList.contains('error-message'))
  ) {
    return nextElement as HTMLElement;
  }
  return null;
}

function showError(errorElement: HTMLElement, message: string): void {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  errorElement.style.color = 'red';
}

function clearError(errorElement: HTMLElement): void {
  errorElement.textContent = '';
  errorElement.style.display = 'none';
}

export function form(formElement: HTMLFormElement): FormValidator {
  const inputs = Array.from(
    formElement.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input, textarea, select'
    )
  );

  if (inputs.length === 0) {
    throw new Error('Form has no inputs');
  }

  const inputsWithoutName = inputs.filter(input => !input.name || input.name.trim() === '');
  if (inputsWithoutName.length > 0) {
    throw new Error('Not all inputs have name attribute');
  }

  for (const input of inputs) {
    if (input instanceof HTMLInputElement && input.type !== 'hidden' && !validateLabelBinding(input)) {
      throw new Error(`Input "${input.name}" has no associated label`);
    }
  }

  const processedCheckboxGroups = new Set<string>();

  for (const input of inputs) {
    if (input instanceof HTMLInputElement && input.type === 'checkbox') {
      if (processedCheckboxGroups.has(input.name)) {
        continue;
      }
      processedCheckboxGroups.add(input.name);
    }

    if (input instanceof HTMLInputElement && input.type !== 'hidden' && !findErrorElement(input)) {
      throw new Error(`Input "${input.name}" has no error message element`);
    }
  }

  const validationRules = new Map<string, Array<() => boolean>>();

  return {
    field(fieldName: string): FieldValidator {
      const element = inputs.find(input => input.name === fieldName);

      if (!element) {
        throw new Error(`Field "${fieldName}" not found`);
      }

      const errorElement = findErrorElement(element);
      if (!errorElement) {
        throw new Error(`Field "${fieldName}" has no error element`);
      }

      if (!validationRules.has(fieldName)) {
        validationRules.set(fieldName, []);
      }

      return {
        string(): StringValidator {
          const validator: StringValidator = {
            min(customMessage?: string) {
              validationRules.get(fieldName)!.push(() => {
                const input = element as HTMLInputElement;
                const value = input.value;

                if (input.required && !value) {
                  const message = customMessage || 'Это поле обязательно';
                  showError(errorElement, message);
                  return false;
                }

                if (!value) {
                  clearError(errorElement);
                  return true;
                }

                const minLength = input.minLength;
                if (minLength > 0 && value.length < minLength) {
                  const message = customMessage || `Минимум ${minLength} символов`;
                  showError(errorElement, message);
                  return false;
                }

                clearError(errorElement);
                return true;
              });
              return validator;
            },

            max(customMessage?: string) {
              validationRules.get(fieldName)!.push(() => {
                const input = element as HTMLInputElement;
                const value = input.value;

                if (!value) {
                  clearError(errorElement);
                  return true;
                }

                const maxLength = input.maxLength;
                if (maxLength > 0 && value.length > maxLength) {
                  const message = customMessage || `Максимум ${maxLength} символов`;
                  showError(errorElement, message);
                  return false;
                }

                clearError(errorElement);
                return true;
              });
              return validator;
            },

            pattern(regex: RegExp, customMessage?: string) {
              validationRules.get(fieldName)!.push(() => {
                const input = element as HTMLInputElement;
                const value = input.value;

                if (value && !regex.test(value)) {
                  const message = customMessage || 'Неверный формат';
                  showError(errorElement, message);
                  return false;
                }

                clearError(errorElement);
                return true;
              });
              return validator;
            },

            required(customMessage?: string) {
              validationRules.get(fieldName)!.push(() => {
                const input = element as HTMLInputElement;
                const value = input.value.trim();

                if (!value) {
                  const message = customMessage || 'Это поле обязательно';
                  showError(errorElement, message);
                  return false;
                }

                clearError(errorElement);
                return true;
              });
              return validator;
            },
          };
          return validator;
        },

        number(): NumberValidator {
          const validator: NumberValidator = {
            min(customMessage?: string) {
              validationRules.get(fieldName)!.push(() => {
                const input = element as HTMLInputElement;
                const value = parseFloat(input.value);

                if (input.required && (input.value === '' || isNaN(value))) {
                  const message = customMessage || 'Это поле обязательно';
                  showError(errorElement, message);
                  return false;
                }

                if (input.value === '' || isNaN(value)) {
                  clearError(errorElement);
                  return true;
                }

                const minValue = input.min ? parseFloat(input.min) : null;
                if (minValue !== null && value < minValue) {
                  const message = customMessage || `Минимум ${minValue}`;
                  showError(errorElement, message);
                  return false;
                }

                clearError(errorElement);
                return true;
              });
              return validator;
            },

            max(customMessage?: string) {
              validationRules.get(fieldName)!.push(() => {
                const input = element as HTMLInputElement;
                const value = parseFloat(input.value);

                if (input.value === '' || isNaN(value)) {
                  clearError(errorElement);
                  return true;
                }

                const maxValue = input.max ? parseFloat(input.max) : null;
                if (maxValue !== null && value > maxValue) {
                  const message = customMessage || `Максимум ${maxValue}`;
                  showError(errorElement, message);
                  return false;
                }

                clearError(errorElement);
                return true;
              });
              return validator;
            },

            required(customMessage?: string) {
              validationRules.get(fieldName)!.push(() => {
                const input = element as HTMLInputElement;
                const value = input.value.trim();

                if (!value) {
                  const message = customMessage || 'Это поле обязательно';
                  showError(errorElement, message);
                  return false;
                }

                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                  const message = customMessage || 'Введите число';
                  showError(errorElement, message);
                  return false;
                }

                clearError(errorElement);
                return true;
              });
              return validator;
            },
          };
          return validator;
        },

        array(): ArrayValidator {
          const validator: ArrayValidator = {
            min(customMessage?: string) {
              validationRules.get(fieldName)!.push(() => {
                const checkboxes = inputs.filter(
                  input => input.name === fieldName &&
                  input instanceof HTMLInputElement &&
                  input.type === 'checkbox'
                ) as HTMLInputElement[];

                const checkedCount = checkboxes.filter(cb => cb.checked).length;

                const firstCheckbox = checkboxes[0];
                let minRequired = 0;

                if (firstCheckbox?.required) {
                  minRequired = 1;
                }

                const dataMin = firstCheckbox?.getAttribute('data-min');
                if (dataMin) {
                  minRequired = parseInt(dataMin, 10);
                }

                if (checkedCount < minRequired) {
                  const message = customMessage || `Выберите минимум ${minRequired}`;
                  showError(errorElement, message);
                  return false;
                }

                clearError(errorElement);
                return true;
              });
              return validator;
            },

            max(customMessage?: string) {
              validationRules.get(fieldName)!.push(() => {
                const checkboxes = inputs.filter(
                  input => input.name === fieldName &&
                  input instanceof HTMLInputElement &&
                  input.type === 'checkbox'
                ) as HTMLInputElement[];

                const checkedCount = checkboxes.filter(cb => cb.checked).length;

                const firstCheckbox = checkboxes[0];
                const dataMax = firstCheckbox?.getAttribute('data-max');
                const maxAllowed = dataMax ? parseInt(dataMax, 10) : Infinity;

                if (checkedCount > maxAllowed) {
                  const message = customMessage || `Выберите максимум ${maxAllowed}`;
                  showError(errorElement, message);
                  return false;
                }

                clearError(errorElement);
                return true;
              });
              return validator;
            },

            required(customMessage?: string) {
              validationRules.get(fieldName)!.push(() => {
                const checkboxes = inputs.filter(
                  input => input.name === fieldName &&
                  input instanceof HTMLInputElement &&
                  input.type === 'checkbox'
                ) as HTMLInputElement[];

                const checkedCount = checkboxes.filter(cb => cb.checked).length;

                if (checkedCount === 0) {
                  const message = customMessage || 'Выберите хотя бы один вариант';
                  showError(errorElement, message);
                  return false;
                }

                clearError(errorElement);
                return true;
              });
              return validator;
            },
          };
          return validator;
        },
      };
    },

    validate(): boolean {
      let isValid = true;

      for (const rules of validationRules.values()) {
        for (const rule of rules) {
          const ruleResult = rule();

          if (!ruleResult) {
            isValid = false;
            break;
          }
        }
      }

      return isValid;
    },
  };
}
