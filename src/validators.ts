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