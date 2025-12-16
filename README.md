# Документация по вашему решению
## Название команды: Пупочный катыш
## Участники

Воротилин Илья Андреевич - vorotilin
Милосердов Николай Сергеевич - Nikolach454 (с 3.12.25)
Иванилов Алексей Тимофеевич - GlennSaren (изгнан 3.12.25)

# Библиотека валидации форм "Katysh"

Простая и удобная TypeScript библиотека для валидации HTML форм с автоматической проверкой структуры и кастомными сообщениями об ошибках.

---

## Требования к HTML структуре

Для корректной работы библиотеки HTML форма должна соответствовать следующим требованиям:

### 1. Форма должна содержать хотя бы одно поле ввода
```html
<form id="myForm" novalidate>
  <!-- минимум один input, textarea или select -->
</form>
```

### 2. Каждое поле должно иметь атрибут `name`
```html
<input type="text" name="username" id="username">
```

### 3. Каждое видимое поле должно быть связано с `<label>`

**Явная связь (через `for` и `id`):**
```html
<label for="username">Имя пользователя</label>
<input type="text" id="username" name="username">
```

**Неявная связь (вложенность):**
```html
<label>
  Имя пользователя
  <input type="text" name="username">
</label>
```

### 4. После каждого поля должен быть элемент для вывода ошибок

Элемент должен иметь класс `error` или `error-message`:
```html
<input type="text" name="username" id="username">
<span class="error-message"></span>
```

**Для группы чекбоксов** элемент ошибки нужен только после первого чекбокса:
```html
<input type="checkbox" name="colors" value="red">
<span class="error-message"></span>

<input type="checkbox" name="colors" value="blue">
<!-- элемент ошибки не нужен -->
```

### 5. HTML атрибуты валидации

Библиотека использует стандартные HTML5 атрибуты:

```html
<input
  type="text"
  name="username"
  required
  minlength="3"
  maxlength="20"
>

<input
  type="number"
  name="age"
  min="18"
  max="100"
>

<input
  type="checkbox"
  name="interests"
  data-min="1"
  data-max="3"
>
```

---

## Пример использования

### HTML
```html
<form id="myForm" novalidate>
  <div>
    <label for="username">Имя пользователя</label>
    <input
      type="text"
      id="username"
      name="username"
      required
      minlength="3"
      maxlength="20"
    >
    <span class="error-message"></span>
  </div>

  <div>
    <label for="age">Возраст</label>
    <input
      type="number"
      id="age"
      name="age"
      required
      min="18"
      max="100"
    >
    <span class="error-message"></span>
  </div>

  <button type="submit">Отправить</button>
</form>
```

### TypeScript
```typescript
import { form } from './validators';

const formElement = document.getElementById('myForm') as HTMLFormElement;
const validator = form(formElement);

validator.field('username')
  .string()
  .required('Имя обязательно')
  .min('Слишком короткое имя')
  .pattern(/^[a-zA-Z]+$/, 'Только латинские буквы');

validator.field('age')
  .number()
  .required('Возраст обязателен')
  .min('Вы слишком молоды')
  .max('Проверьте возраст');

formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  if (validator.validate()) {
    console.log('Форма валидна!');
  } else {
    console.log('Форма содержит ошибки');
  }
});
```

---

## API

### `form(formElement: HTMLFormElement): FormValidator`

Создаёт валидатор для HTML формы. При создании автоматически проверяет:
- Наличие полей в форме
- Наличие атрибута `name` у всех полей
- Связь каждого поля с `<label>`
- Наличие элемента для вывода ошибок после каждого поля

**Выбрасывает исключение**, если структура формы некорректна.

### `FormValidator`

#### `.field(fieldName: string): FieldValidator`

Выбирает поле для настройки валидации по атрибуту `name`.

#### `.validate(): boolean`

Запускает все правила валидации. Возвращает `true`, если форма валидна.

### `FieldValidator`

#### `.string(): StringValidator`

Настраивает валидацию для строковых полей (`text`, `email`, `password`, `textarea`).

#### `.number(): NumberValidator`

Настраивает валидацию для числовых полей (`number`).

#### `.array(): ArrayValidator`

Настраивает валидацию для полей с множественным выбором (`checkbox`).

### `StringValidator`

Методы возвращают `StringValidator` для цепочки вызовов.

#### `.required(message?: string): StringValidator`

Проверяет, что поле заполнено.

#### `.min(message?: string): StringValidator`

Проверяет минимальную длину строки (использует атрибут `minlength`).

#### `.max(message?: string): StringValidator`

Проверяет максимальную длину строки (использует атрибут `maxlength`).

#### `.pattern(regex: RegExp, message?: string): StringValidator`

Проверяет соответствие регулярному выражению.

### `NumberValidator`

Методы возвращают `NumberValidator` для цепочки вызовов.

#### `.required(message?: string): NumberValidator`

Проверяет, что поле заполнено и содержит число.

#### `.min(message?: string): NumberValidator`

Проверяет минимальное значение (использует атрибут `min`).

#### `.max(message?: string): NumberValidator`

Проверяет максимальное значение (использует атрибут `max`).

### `ArrayValidator`

Методы возвращают `ArrayValidator` для цепочки вызовов.

#### `.required(message?: string): ArrayValidator`

Проверяет, что выбран хотя бы один элемент.

#### `.min(message?: string): ArrayValidator`

Проверяет минимальное количество выбранных элементов (использует атрибуты `required` или `data-min`).

#### `.max(message?: string): ArrayValidator`

Проверяет максимальное количество выбранных элементов (использует атрибут `data-max`).

---

## Полнота реализации

### Реализовано
✅ Проверка структуры формы при инициализации
✅ Валидация строковых полей (min, max, pattern, required)
✅ Валидация числовых полей (min, max, required)
✅ Валидация чекбоксов (min, max, required)
✅ Кастомные сообщения об ошибках
✅ Автоматический вывод ошибок в HTML
✅ Поддержка HTML5 Constraint Validation API
✅ TypeScript типизация

### Не реализовано
❌ Валидация radio buttons
❌ Валидация select с multiple
❌ Async валидация (например, проверка на сервере)
❌ Кастомные валидаторы
❌ Интернационализация сообщений

---

## Понятность и удобство

### Преимущества
- Декларативный API с цепочкой вызовов
- Автоматическая проверка корректности HTML структуры
- Работает с нативными HTML атрибутами валидации
- Кастомные сообщения об ошибках на русском языке
- Полная типизация TypeScript

### Ограничения
- Требует строгую структуру HTML
- Один элемент ошибки на поле (или группу чекбоксов)
- Проверка только при вызове `validate()` или по событию

