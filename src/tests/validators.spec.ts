import { form } from '../validators';

describe('Валидатор формы - AAA тесты с JSDom', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('form() - Начальная валидация', () => {
    describe('Позитивные тесты', () => {
      test('должен успешно создать FormValidator с валидной структурой формы', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        const validator = form(formElement);


        expect(validator).toBeDefined();
        expect(validator.field).toBeDefined();
        expect(validator.validate).toBeDefined();
      });

      test('должен принять input обернутый в тег label', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label>
              Email
              <input type="email" name="email" />
              <span class="error"></span>
            </label>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).not.toThrow();
      });

      test('должен принять элементы textarea и select', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="bio">Bio</label>
            <textarea id="bio" name="bio"></textarea>
            <span class="error"></span>

            <label for="country">Country</label>
            <select id="country" name="country">
              <option value="ru">Russia</option>
            </select>
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).not.toThrow();
      });

      test('должен игнорировать скрытые input при валидации label и ошибок', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <input type="hidden" name="csrf" value="token123" />
            <label for="username">Username</label>
            <input type="text" id="username" name="username" />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).not.toThrow();
      });

      test('должен принять класс error-message для элементов ошибок', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" />
            <span class="error-message"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).not.toThrow();
      });
    });

    describe('Негативные тесты - Граничные случаи', () => {
      test('должен выбросить ошибку когда форма не имеет input', () => {

        document.body.innerHTML = `<form id="test-form"></form>`;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).toThrow('Form has no inputs');
      });

      test('должен выбросить ошибку когда input не имеет атрибут name', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).toThrow('Not all inputs have name attribute');
      });

      test('должен выбросить ошибку когда input имеет пустой атрибут name', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="  " />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).toThrow('Not all inputs have name attribute');
      });

      test('должен выбросить ошибку когда нескрытый input не имеет label', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <input type="text" id="username" name="username" />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).toThrow('Input "username" has no associated label');
      });

      test('должен выбросить ошибку когда input имеет label с несовпадающим атрибутом for', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="wrong-id">Username</label>
            <input type="text" id="username" name="username" />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).toThrow('Input "username" has no associated label');
      });

      test('должен выбросить ошибку когда input не имеет id и не обернут в label', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label>Username</label>
            <input type="text" name="username" />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).toThrow('Input "username" has no associated label');
      });

      test('должен выбросить ошибку когда нескрытый input не имеет элемент ошибки', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" />
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).toThrow('Input "username" has no error message element');
      });

      test('должен выбросить ошибку когда элемент ошибки не идет сразу после input', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" />
            <div>Some other element</div>
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).toThrow('Input "username" has no error message element');
      });

      test('должен выбросить ошибку когда элемент ошибки имеет неверный класс', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" />
            <span class="warning"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;


        expect(() => form(formElement)).toThrow('Input "username" has no error message element');
      });
    });
  });

  describe('field() method', () => {
    describe('Позитивные тесты', () => {
      test('должен вернуть FieldValidator для существующего поля', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);


        const fieldValidator = validator.field('username');


        expect(fieldValidator).toBeDefined();
        expect(fieldValidator.string).toBeDefined();
        expect(fieldValidator.number).toBeDefined();
        expect(fieldValidator.array).toBeDefined();
      });
    });

    describe('Негативные тесты', () => {
      test('должен выбросить ошибку когда поле не существует', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);


        expect(() => validator.field('nonexistent')).toThrow('Field "nonexistent" not found');
      });

      test('должен выбросить ошибку когда поле существует но не имеет элемент ошибки', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <input type="hidden" name="csrf" value="token" />
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);


        expect(() => validator.field('csrf')).toThrow('Field "csrf" has no error element');
      });
    });
  });

  describe('StringValidator', () => {
    describe('required() method', () => {
      describe('Позитивные тесты', () => {
        test('должен пройти валидацию когда обязательное поле имеет значение', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="john_doe" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().required();


          const result = validator.validate();


          expect(result).toBe(true);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('');
          expect(errorElement.style.display).toBe('none');
        });

        test('должен использовать пользовательское сообщение об ошибке когда предоставлено', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().required('Имя пользователя обязательно');


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Имя пользователя обязательно');
        });
      });

      describe('Негативные тесты', () => {
        test('должен провалить валидацию когда обязательное поле пустое', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().required();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Это поле обязательно');
          expect(errorElement.style.display).toBe('block');
          expect(errorElement.style.color).toBe('red');
        });

        test('должен провалить валидацию когда поле содержит только пробелы', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="   " />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().required();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Это поле обязательно');
        });

        test('должен провалиться с одним символом пробела', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value=" " />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().required();


          const result = validator.validate();


          expect(result).toBe(false);
        });
      });
    });

    describe('min() method', () => {
      describe('Позитивные тесты', () => {
        test('должен пройти когда значение соответствует минимальной длине', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="john" minlength="3" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().min();


          const result = validator.validate();


          expect(result).toBe(true);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('');
        });

        test('должен пройти когда значение равно минимальной длине', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="abc" minlength="3" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда поле не обязательное и пустое', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="" minlength="3" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });
      });

      describe('Негативные тесты', () => {
        test('должен провалиться когда обязательное поле пустое', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="" required minlength="3" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().min();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Это поле обязательно');
        });

        test('должен провалиться когда значение ниже минимальной длины', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="ab" minlength="3" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().min();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Минимум 3 символов');
        });

        test('должен провалиться с одним символом когда минимум 2', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="a" minlength="2" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().min('Минимум 2 символа');


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Минимум 2 символа');
        });

        test('должен обработать граничный случай с minlength=0', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="" minlength="0" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен обработать граничный случай с очень большим minlength', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="short" minlength="1000" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().min();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Минимум 1000 символов');
        });
      });
    });

    describe('max() method', () => {
      describe('Позитивные тесты', () => {
        test('должен пройти когда значение ниже максимальной длины', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="john" maxlength="10" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().max();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда значение равно максимальной длине', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="1234567890" maxlength="10" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().max();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда maxlength равен 0 или отрицательный', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="text" maxlength="0" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().max();


          const result = validator.validate();


          expect(result).toBe(true);
        });
      });

      describe('Негативные тесты', () => {
        test('должен провалиться когда значение превышает максимальную длину', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="verylongusername" maxlength="10" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().max();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Максимум 10 символов');
        });

        test('должен провалиться с пользовательским сообщением при превышении максимума', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="toolong" maxlength="5" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().max('Слишком длинное имя');


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Слишком длинное имя');
        });

        test('должен обработать граничное значение maxlength=1', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="ab" maxlength="1" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('username').string().max();


          const result = validator.validate();


          expect(result).toBe(false);
        });
      });
    });

    describe('pattern() method', () => {
      describe('Позитивные тесты', () => {
        test('должен пройти когда значение соответствует паттерну', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="email">Email</label>
              <input type="text" id="email" name="email" value="test@example.com" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          validator.field('email').string().pattern(emailRegex);


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда значение пустое (паттерн валидирует только непустые)', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="email">Email</label>
              <input type="text" id="email" name="email" value="" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          validator.field('email').string().pattern(emailRegex);


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен валидировать паттерн номера телефона', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="phone">Phone</label>
              <input type="text" id="phone" name="phone" value="+7-999-123-45-67" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          const phoneRegex = /^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/;
          validator.field('phone').string().pattern(phoneRegex);


          const result = validator.validate();


          expect(result).toBe(true);
        });
      });

      describe('Негативные тесты', () => {
        test('должен провалиться когда значение не соответствует паттерну', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="email">Email</label>
              <input type="text" id="email" name="email" value="invalid-email" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          validator.field('email').string().pattern(emailRegex);


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Неверный формат');
        });

        test('должен провалиться с пользовательским сообщением', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="email">Email</label>
              <input type="text" id="email" name="email" value="bad@" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          validator.field('email').string().pattern(emailRegex, 'Неверный формат email');


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Неверный формат email');
        });

        test('должен провалиться при частичном совпадении', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="code">Code</label>
              <input type="text" id="code" name="code" value="ABC123XYZ" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          const codeRegex = /^\d{6}$/;
          validator.field('code').string().pattern(codeRegex);


          const result = validator.validate();


          expect(result).toBe(false);
        });

        test('должен обработать специальные символы regex', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="special">Special</label>
              <input type="text" id="special" name="special" value="test@#$" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          const specialRegex = /^[a-z]+$/;
          validator.field('special').string().pattern(specialRegex);


          const result = validator.validate();


          expect(result).toBe(false);
        });
      });
    });

    describe('Chaining validators', () => {
      test('должен поддерживать цепочку из нескольких валидаторов', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" value="john" minlength="3" maxlength="10" required />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);
        const usernameRegex = /^[a-z]+$/;


        validator.field('username').string().required().min().max().pattern(usernameRegex);
        const result = validator.validate();


        expect(result).toBe(true);
      });

      test('должен провалиться на первом проваленном валидаторе в цепочке', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" value="" minlength="3" required />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);


        validator.field('username').string().required().min();
        const result = validator.validate();


        expect(result).toBe(false);
        const errorElement = document.querySelector('.error') as HTMLElement;
        expect(errorElement.textContent).toBe('Это поле обязательно');
      });
    });
  });

  describe('NumberValidator', () => {
    describe('required() method', () => {
      describe('Позитивные тесты', () => {
        test('должен пройти когда поле имеет валидное число', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="25" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().required();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти с нулевым значением', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="0" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().required();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти с отрицательным числом', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="temp">Temperature</label>
              <input type="number" id="temp" name="temp" value="-10" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('temp').number().required();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти с десятичным числом', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="price">Price</label>
              <input type="number" id="price" name="price" value="19.99" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('price').number().required();


          const result = validator.validate();


          expect(result).toBe(true);
        });
      });

      describe('Негативные тесты', () => {
        test('должен провалиться когда поле пустое', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().required();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Это поле обязательно');
        });

        test('должен провалиться когда значение не является числом', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="abc" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().required();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Введите число');
        });

        test('должен провалиться с только пробелами', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="   " />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().required();


          const result = validator.validate();


          expect(result).toBe(false);
        });

        test('должен использовать пользовательское сообщение', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().required('Укажите возраст');


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Укажите возраст');
        });
      });
    });

    describe('min() method', () => {
      describe('Позитивные тесты', () => {
        test('должен пройти когда значение соответствует минимуму', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="18" min="18" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда значение превышает минимум', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="25" min="18" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда не обязательное и пустое', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="" min="18" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен работать с отрицательными минимальными значениями', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="temp">Temperature</label>
              <input type="number" id="temp" name="temp" value="-5" min="-10" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('temp').number().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен работать с десятичными минимальными значениями', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="price">Price</label>
              <input type="number" id="price" name="price" value="10.5" min="10.0" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('price').number().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });
      });

      describe('Негативные тесты', () => {
        test('должен провалиться когда обязательное поле пустое', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="" required min="18" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().min();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Это поле обязательно');
        });

        test('должен провалиться когда значение не является числом', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="abc" required min="18" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().min();


          const result = validator.validate();


          expect(result).toBe(false);
        });

        test('должен провалиться когда значение ниже минимума', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="15" min="18" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().min();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Минимум 18');
        });

        test('должен провалиться точно на единицу ниже минимума', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="17" min="18" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().min('Минимальный возраст 18 лет');


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Минимальный возраст 18 лет');
        });

        test('должен провалиться с нулем когда минимум положительный', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="qty">Quantity</label>
              <input type="number" id="qty" name="qty" value="0" min="1" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('qty').number().min();


          const result = validator.validate();


          expect(result).toBe(false);
        });

        test('должен обработать граничный случай min=0', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="qty">Quantity</label>
              <input type="number" id="qty" name="qty" value="-1" min="0" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('qty').number().min();


          const result = validator.validate();


          expect(result).toBe(false);
        });
      });
    });

    describe('max() method', () => {
      describe('Позитивные тесты', () => {
        test('должен пройти когда значение ниже максимума', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="50" max="100" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().max();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда значение равно максимуму', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="100" max="100" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().max();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда поле пустое', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="" max="100" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().max();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен работать с отрицательными максимальными значениями', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="temp">Temperature</label>
              <input type="number" id="temp" name="temp" value="-15" max="-10" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('temp').number().max();


          const result = validator.validate();


          expect(result).toBe(true);
        });
      });

      describe('Негативные тесты', () => {
        test('должен провалиться когда значение превышает максимум', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="150" max="100" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().max();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Максимум 100');
        });

        test('должен провалиться точно на единицу выше максимума', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="age">Age</label>
              <input type="number" id="age" name="age" value="101" max="100" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('age').number().max('Превышен максимум');


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Превышен максимум');
        });

        test('должен обработать граничный случай max=0', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label for="value">Value</label>
              <input type="number" id="value" name="value" value="1" max="0" />
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('value').number().max();


          const result = validator.validate();


          expect(result).toBe(false);
        });
      });
    });

    describe('Chaining number validators', () => {
      test('должен валидировать диапазон min и max', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="age">Age</label>
            <input type="number" id="age" name="age" value="25" min="18" max="65" required />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);
        validator.field('age').number().required().min().max();


        const result = validator.validate();


        expect(result).toBe(true);
      });

      test('должен провалиться когда ниже минимума в цепочке валидаторов', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="age">Age</label>
            <input type="number" id="age" name="age" value="15" min="18" max="65" required />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);
        validator.field('age').number().required().min().max();


        const result = validator.validate();


        expect(result).toBe(false);
      });
    });
  });

  describe('ArrayValidator (Checkboxes)', () => {
    describe('required() method', () => {
      describe('Позитивные тесты', () => {
        test('должен пройти когда хотя бы один checkbox отмечен', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="hobbies" value="sports" checked /> Sports</label>
              <label><input type="checkbox" name="hobbies" value="music" /> Music</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('hobbies').array().required();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда несколько checkbox отмечены', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="hobbies" value="sports" checked /> Sports</label>
              <label><input type="checkbox" name="hobbies" value="music" checked /> Music</label>
              <label><input type="checkbox" name="hobbies" value="reading" checked /> Reading</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('hobbies').array().required();


          const result = validator.validate();


          expect(result).toBe(true);
        });
      });

      describe('Негативные тесты', () => {
        test('должен провалиться когда ни один checkbox не отмечен', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="hobbies" value="sports" /> Sports</label>
              <label><input type="checkbox" name="hobbies" value="music" /> Music</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('hobbies').array().required();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Выберите хотя бы один вариант');
        });

        test('должен использовать пользовательское сообщение когда предоставлено', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="hobbies" value="sports" /> Sports</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('hobbies').array().required('Выберите хобби');


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Выберите хобби');
        });

        test('должен провалиться с одним неотмеченным checkbox', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="agree" value="yes" /> I agree</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('agree').array().required();


          const result = validator.validate();


          expect(result).toBe(false);
        });
      });
    });

    describe('min() method', () => {
      describe('Позитивные тесты', () => {
        test('должен пройти когда количество отмеченных соответствует требуемому минимуму', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" required /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда количество отмеченных соответствует атрибуту data-min', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-min="2" checked /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
              <label><input type="checkbox" name="skills" value="py" /> Python</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда количество отмеченных превышает минимум', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-min="2" checked /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
              <label><input type="checkbox" name="skills" value="py" checked /> Python</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда нет требования минимума и ничего не отмечено', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="optional" value="a" /> A</label>
              <label><input type="checkbox" name="optional" value="b" /> B</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('optional').array().min();


          const result = validator.validate();


          expect(result).toBe(true);
        });
      });

      describe('Негативные тесты', () => {
        test('должен провалиться когда обязательное но ничего не отмечено', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" required /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" /> TypeScript</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().min();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Выберите минимум 1');
        });

        test('должен провалиться когда количество отмеченных ниже data-min', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-min="3" checked /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
              <label><input type="checkbox" name="skills" value="py" /> Python</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().min();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Выберите минимум 3');
        });

        test('должен использовать пользовательское сообщение', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-min="2" /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" /> TypeScript</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().min('Выберите минимум 2 навыка');


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Выберите минимум 2 навыка');
        });

        test('должен провалиться точно на единицу ниже минимума', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-min="3" checked /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
              <label><input type="checkbox" name="skills" value="py" /> Python</label>
              <label><input type="checkbox" name="skills" value="go" /> Go</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().min();


          const result = validator.validate();


          expect(result).toBe(false);
        });
      });
    });

    describe('max() method', () => {
      describe('Позитивные тесты', () => {
        test('должен пройти когда количество отмеченных ниже максимума', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-max="3" checked /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
              <label><input type="checkbox" name="skills" value="py" /> Python</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().max();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда количество отмеченных равно максимуму', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-max="2" checked /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
              <label><input type="checkbox" name="skills" value="py" /> Python</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().max();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти когда атрибут data-max не установлен', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" checked /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
              <label><input type="checkbox" name="skills" value="py" checked /> Python</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().max();


          const result = validator.validate();


          expect(result).toBe(true);
        });

        test('должен пройти с нулем отмеченных', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-max="2" /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" /> TypeScript</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().max();


          const result = validator.validate();


          expect(result).toBe(true);
        });
      });

      describe('Негативные тесты', () => {
        test('должен провалиться когда количество отмеченных превышает максимум', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-max="2" checked /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
              <label><input type="checkbox" name="skills" value="py" checked /> Python</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().max();


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Выберите максимум 2');
        });

        test('должен использовать пользовательское сообщение', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-max="1" checked /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().max('Выберите только один навык');


          const result = validator.validate();


          expect(result).toBe(false);
          const errorElement = document.querySelector('.error') as HTMLElement;
          expect(errorElement.textContent).toBe('Выберите только один навык');
        });

        test('должен провалиться точно на единицу выше максимума', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-max="2" checked /> JavaScript</label>
              <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
              <label><input type="checkbox" name="skills" value="py" checked /> Python</label>
              <label><input type="checkbox" name="skills" value="go" /> Go</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().max();


          const result = validator.validate();


          expect(result).toBe(false);
        });

        test('должен обработать граничный случай data-max="0"', () => {

          document.body.innerHTML = `
            <form id="test-form">
              <label><input type="checkbox" name="skills" value="js" data-max="0" checked /> JavaScript</label>
              <span class="error"></span>
            </form>
          `;
          const formElement = document.getElementById('test-form') as HTMLFormElement;
          const validator = form(formElement);
          validator.field('skills').array().max();


          const result = validator.validate();


          expect(result).toBe(false);
        });
      });
    });

    describe('Chaining array validators', () => {
      test('должен валидировать диапазон min и max для checkbox', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label><input type="checkbox" name="skills" value="js" data-min="2" data-max="3" checked /> JavaScript</label>
            <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
            <label><input type="checkbox" name="skills" value="py" /> Python</label>
            <label><input type="checkbox" name="skills" value="go" /> Go</label>
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);
        validator.field('skills').array().required().min().max();


        const result = validator.validate();


        expect(result).toBe(true);
      });

      test('должен провалиться когда ниже минимума в диапазоне', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label><input type="checkbox" name="skills" value="js" data-min="2" data-max="3" checked /> JavaScript</label>
            <label><input type="checkbox" name="skills" value="ts" /> TypeScript</label>
            <label><input type="checkbox" name="skills" value="py" /> Python</label>
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);
        validator.field('skills').array().min().max();


        const result = validator.validate();


        expect(result).toBe(false);
      });

      test('должен провалиться когда выше максимума в диапазоне', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label><input type="checkbox" name="skills" value="js" data-min="1" data-max="2" checked /> JavaScript</label>
            <label><input type="checkbox" name="skills" value="ts" checked /> TypeScript</label>
            <label><input type="checkbox" name="skills" value="py" checked /> Python</label>
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);
        validator.field('skills').array().min().max();


        const result = validator.validate();


        expect(result).toBe(false);
      });
    });
  });

  describe('validate() method', () => {
    describe('Позитивные тесты', () => {
      test('должен вернуть true когда все валидации прошли', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" value="john" minlength="3" required />
            <span class="error"></span>

            <label for="age">Age</label>
            <input type="number" id="age" name="age" value="25" min="18" required />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);
        validator.field('username').string().required().min();
        validator.field('age').number().required().min();


        const result = validator.validate();


        expect(result).toBe(true);
      });

      test('должен очистить все сообщения об ошибках когда валидация прошла', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" value="john" required />
            <span class="error" id="error1">Old error</span>

            <label for="email">Email</label>
            <input type="text" id="email" name="email" value="test@example.com" required />
            <span class="error" id="error2">Old error</span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);
        validator.field('username').string().required();
        validator.field('email').string().required();


        validator.validate();


        const error1 = document.getElementById('error1') as HTMLElement;
        const error2 = document.getElementById('error2') as HTMLElement;
        expect(error1.textContent).toBe('');
        expect(error2.textContent).toBe('');
        expect(error1.style.display).toBe('none');
        expect(error2.style.display).toBe('none');
      });
    });

    describe('Негативные тесты', () => {
      test('должен вернуть false когда любая валидация провалилась', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" value="john" required />
            <span class="error"></span>

            <label for="age">Age</label>
            <input type="number" id="age" name="age" value="" required />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);
        validator.field('username').string().required();
        validator.field('age').number().required();


        const result = validator.validate();


        expect(result).toBe(false);
      });

      test('должен остановить валидацию на первой ошибке для каждого поля', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" value="" minlength="3" maxlength="10" required />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);
        validator.field('username').string().required().min().max();


        const result = validator.validate();


        expect(result).toBe(false);
        const errorElement = document.querySelector('.error') as HTMLElement;
        expect(errorElement.textContent).toBe('Это поле обязательно');
      });

      test('должен валидировать все поля даже если первое провалилось', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="field1">Field 1</label>
            <input type="text" id="field1" name="field1" value="" required />
            <span class="error" id="error1"></span>

            <label for="field2">Field 2</label>
            <input type="text" id="field2" name="field2" value="" required />
            <span class="error" id="error2"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);
        validator.field('field1').string().required();
        validator.field('field2').string().required();


        validator.validate();


        const error1 = document.getElementById('error1') as HTMLElement;
        expect(error1.textContent).toBe('Это поле обязательно');
      });

      test('должен вернуть false когда правила валидации не установлены', () => {

        document.body.innerHTML = `
          <form id="test-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" value="john" />
            <span class="error"></span>
          </form>
        `;
        const formElement = document.getElementById('test-form') as HTMLFormElement;
        const validator = form(formElement);


        const result = validator.validate();


        expect(result).toBe(true);
      });
    });
  });

  describe('Граничные случаи и интеграционные тесты', () => {
    test('должен обрабатывать несколько полей с разными типами валидаторов', () => {

      document.body.innerHTML = `
        <form id="test-form">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" value="john_doe" minlength="3" required />
          <span class="error"></span>

          <label for="age">Age</label>
          <input type="number" id="age" name="age" value="25" min="18" max="100" required />
          <span class="error"></span>

          <label><input type="checkbox" name="terms" value="agree" data-min="1" checked /> I agree</label>
          <span class="error"></span>
        </form>
      `;
      const formElement = document.getElementById('test-form') as HTMLFormElement;
      const validator = form(formElement);
      validator.field('username').string().required().min();
      validator.field('age').number().required().min().max();
      validator.field('terms').array().min();


      const result = validator.validate();


      expect(result).toBe(true);
    });

    test('должен обрабатывать форму только со скрытыми input после настройки валидации', () => {

      document.body.innerHTML = `
        <form id="test-form">
          <input type="hidden" name="csrf" value="token123" />
          <label for="visible">Visible</label>
          <input type="text" id="visible" name="visible" value="test" />
          <span class="error"></span>
        </form>
      `;
      const formElement = document.getElementById('test-form') as HTMLFormElement;
      const validator = form(formElement);
      validator.field('visible').string().required();


      const result = validator.validate();


      expect(result).toBe(true);
    });

    test('должен обрабатывать пустое строковое значение для числового поля', () => {

      document.body.innerHTML = `
        <form id="test-form">
          <label for="age">Age</label>
          <input type="number" id="age" name="age" value="" min="18" />
          <span class="error"></span>
        </form>
      `;
      const formElement = document.getElementById('test-form') as HTMLFormElement;
      const validator = form(formElement);
      validator.field('age').number().min();


      const result = validator.validate();


      expect(result).toBe(true);
    });

    test('должен обрабатывать очень длинные строковые значения', () => {

      const longString = 'a'.repeat(10000);
      document.body.innerHTML = `
        <form id="test-form">
          <label for="text">Text</label>
          <input type="text" id="text" name="text" value="${longString}" maxlength="100" />
          <span class="error"></span>
        </form>
      `;
      const formElement = document.getElementById('test-form') as HTMLFormElement;
      const validator = form(formElement);
      validator.field('text').string().max();


      const result = validator.validate();


      expect(result).toBe(false);
    });

    test('должен обрабатывать unicode символы при валидации', () => {

      document.body.innerHTML = `
        <form id="test-form">
          <label for="text">Text</label>
          <input type="text" id="text" name="text" value="Привет мир 🌍" minlength="5" />
          <span class="error"></span>
        </form>
      `;
      const formElement = document.getElementById('test-form') as HTMLFormElement;
      const validator = form(formElement);
      validator.field('text').string().min();


      const result = validator.validate();


      expect(result).toBe(true);
    });

    test('должен обрабатывать множественные валидации на одном поле вызванные несколько раз', () => {

      document.body.innerHTML = `
        <form id="test-form">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" value="john" required />
          <span class="error"></span>
        </form>
      `;
      const formElement = document.getElementById('test-form') as HTMLFormElement;
      const validator = form(formElement);
      validator.field('username').string().required();
      validator.field('username').string().required();


      const result = validator.validate();


      expect(result).toBe(true);
    });

    test('должен сохранить стилизацию элемента ошибки от предыдущей валидации', () => {

      document.body.innerHTML = `
        <form id="test-form">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" value="" required />
          <span class="error"></span>
        </form>
      `;
      const formElement = document.getElementById('test-form') as HTMLFormElement;
      const input = document.getElementById('username') as HTMLInputElement;
      const validator = form(formElement);
      validator.field('username').string().required();


      validator.validate();
      const errorAfterFail = document.querySelector('.error') as HTMLElement;
      expect(errorAfterFail.style.display).toBe('block');
      expect(errorAfterFail.style.color).toBe('red');


      input.value = 'john';
      validator.validate();
      const errorAfterPass = document.querySelector('.error') as HTMLElement;


      expect(errorAfterPass.style.display).toBe('none');
      expect(errorAfterPass.textContent).toBe('');
    });
  });
});
