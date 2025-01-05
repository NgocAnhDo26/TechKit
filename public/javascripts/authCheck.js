const registerForm = document.getElementById('register-form');
const registerSubmit = document.querySelector('.register-submit');
const loginSubmit = document.querySelector('.login-submit');
const forgotPasswordSubmit = document.querySelector('.forgot-password-submit');

// Register
// Check if this page has register submit button
if (registerSubmit && registerForm) {
  const emailPattern = /^\S+@\S+\.\S+$/;
  const passwordPattern = /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/;

  registerSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value,
      email = document.getElementById('register-email').value,
      password = document.getElementById('register-password').value,
      confirmPassword = document.getElementById(
        'register-confirmPassword',
      ).value,
      errorContainer = document.querySelector('.error-container-register'),
      errorElement = document.querySelector('.error-text-register');

    if (isEmpty(name, email, password, confirmPassword)) {
      displayError(
        errorContainer,
        errorElement,
        'Những thông tin bên dưới không được để trống',
      );
      return;
    }

    const fieldErrors = document.querySelectorAll('.error-register');
    const hasVisibleError = Array.from(fieldErrors).some(
      (err) => !err.classList.contains('hidden'),
    );
    if (hasVisibleError) {
      displayError(
        errorContainer,
        errorElement,
        'Vui lòng kiểm tra lại thông tin nhập',
      );
      return;
    }

    await fetch('/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Mail kích hoạt đã được gửi đến email của bạn',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          displayError(
            errorContainer,
            errorElement,
            data.message || 'Đăng ký thất bại. Vui lòng thử lại',
          );
        }
      });
  });

  registerForm.addEventListener(
    'blur',
    async (e) => {
      const { value, name } = e.target;
      if (!value) return;

      if (name === 'email') {
        const error = document.querySelector('.error-register.email');
        if (!emailPattern.test(value)) {
          error.textContent = 'Vui lòng nhập đúng định dạng email';
          error.classList.remove('hidden');
        }
        await fetch(`/auth/register?email=${encodeURIComponent(value)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              error.textContent = data.error;
              error.classList.remove('hidden');
            }
          })
          .catch((err) => console.error('Error:', err));
      }

      if (name === 'password' && !passwordPattern.test(value)) {
        const error = document.querySelector('.error-register.password');
        error.textContent =
          'Mật khẩu phải chứa ít nhất 1 chữ số và 1 chữ cái, từ 8 đến 32 ký tự';
        error.classList.remove('hidden');
      }

      if (
        name === 'confirmPassword' &&
        value !== document.getElementById('register-password').value
      ) {
        const error = document.querySelector('.error-register.confirmPassword');
        error.textContent = 'Mật khẩu không khớp';
        error.classList.remove('hidden');
      }
    },
    true,
  );

  registerForm.addEventListener(
    'focus',
    (e) => {
      const { name } = e.target;
      if (name !== 'submit') {
        const error = document.querySelector(`.error-register.${name}`);
        if (error) error.classList.add('hidden');
      }
    },
    true,
  );
}

// Login
// Check if this page has login submit button
if (loginSubmit) {
  loginSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value,
      password = document.getElementById('login-password').value,
      errorContainer = document.querySelector('.error-container-login'),
      errorElement = document.querySelector('.error-text-login');

    if (isEmpty(email, password)) {
      displayError(
        errorContainer,
        errorElement,
        'Những thông tin bên dưới không được để trống',
      );
      return;
    }

    await fetch('/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Đăng nhập thành công',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          }).then(() => {
            window.location.href = data.redirectUrl;
          });
        } else {
          displayError(
            errorContainer,
            errorElement,
            data.message || 'Đăng nhập thất bại. Vui lòng thử lại',
          );
        }
      });
  });
}

// Forgot Password
if (forgotPasswordSubmit) {
  forgotPasswordSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-password-email').value,
      errorContainer = document.querySelector(
        '.error-container-forgotPassword',
      ),
      errorElement = document.querySelector('.error-text-forgotPassword');

    if (isEmpty(email)) {
      displayError(
        errorContainer,
        errorElement,
        'Nhung thông tin bên dưới không được để trống',
      );
      return;
    }

    await fetch('/auth/forgot-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Mật khẩu mới đã được gửi đến email của bạn',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          }).then(() => {
            window.location.href = '/auth/login';
          });
        } else {
          displayError(
            errorContainer,
            errorElement,
            data.message || 'Quá trình khôi phục mật khẩu thất bại',
          );
        }
      });
  });
}

// Show error in container
function displayError(container, errorElement, message) {
  container.classList.remove('hidden');
  errorElement.textContent = message;
  setTimeout(() => {
    container.classList.add('hidden');
  }, 5000);
}

// Check for empty fields
function isEmpty(...fields) {
  return fields.some((field) => !field || !field.trim().length);
}
