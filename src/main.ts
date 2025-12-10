import { KatyshFormValidator } from './validators';

const form = document.getElementById('testForm') as HTMLFormElement;
const validator = KatyshFormValidator(form);

validator.field('username').string()
  .min('Минимум 3 символа')
  .max('Максимум 20 символов')
  .pattern(/^[a-zA-Z]+$/, 'Только латинские буквы');

validator.field('age').number()
  .min('Минимум 18')
  .max('Максимум 100');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (validator.validate()) {
    alert('Форма валидна!');
  } else {
    alert('Ошибка валидации!');
  }
});
