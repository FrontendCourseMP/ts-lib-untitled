export { form } from './validators';

export type {
  FormValidator,
  FieldValidator,
  StringValidator,
  NumberValidator,
  ArrayValidator,
} from './types/types';

import { form } from './validators';

const formElement = document.getElementById('testForm') as HTMLFormElement;

if (formElement) {
  const validator = form(formElement);

  validator.field('username')
    .string()
    .required('Имя обязательно')
    .min('Слишком короткое имя')
    .pattern(/^[a-zA-Zа-яА-Я]+$/, 'Только буквы');

  validator.field('age')
    .number()
    .required('Возраст обязателен')
    .min('Вы слишком молоды')
    .max('Проверьте возраст');

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const isValid = validator.validate();

    if (isValid) {
      const successMessage = document.createElement('div');
      successMessage.textContent = '✓ Форма успешно отправлена!';
      successMessage.style.cssText = 'color: green; margin-top: 10px; padding: 10px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px;';
      formElement.appendChild(successMessage);

      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    }
  });
}
