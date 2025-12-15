export type KatyshFormAPI = {
  form: (formElement: HTMLFormElement) => FormValidator;
};

export type FormValidator = {
  field: (fieldName: string) => FieldValidator;
  validate: () => boolean;
};

export type FieldValidator = {
  string: () => StringValidator;
  number: () => NumberValidator;
  array: () => ArrayValidator;
};

export type StringValidator = {
  min: (message?: string) => StringValidator;
  max: (message?: string) => StringValidator;
  pattern: (pattern: RegExp, message?: string) => StringValidator;
  required: (message?: string) => StringValidator;
};

export type NumberValidator = {
  min: (message?: string) => NumberValidator;
  max: (message?: string) => NumberValidator;
  required: (message?: string) => NumberValidator;
};

export type ArrayValidator = {
  min: (message?: string) => ArrayValidator;
  max: (message?: string) => ArrayValidator;
  required: (message?: string) => ArrayValidator;
};

export type ValidityStateType = {
  valid: boolean;
  valueMissing: boolean;
  typeMismatch: boolean;
  patternMismatch: boolean;
  tooLong: boolean;
  tooShort: boolean;
  rangeUnderflow: boolean;
  rangeOverflow: boolean;
  stepMismatch: boolean;
  badInput: boolean;
  customError: boolean;
};