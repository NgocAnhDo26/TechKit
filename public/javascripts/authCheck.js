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
            errorContainer = document.querySelector(
                '.error-container-register',
            ),
            errorElement = document.querySelector('.error-text-register');

        autoHideErrorContainer(errorContainer);

        if (isEmpty(name, email, password, confirmPassword)) {
            displayError(
                errorContainer,
                errorElement,
                'The fields below must not be empty',
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
                'Please check your responses and try again',
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
                        title: 'Activation email sent to your email address',
                        timer: 3000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                } else {
                    displayError(
                        errorContainer,
                        errorElement,
                        data.message ||
                            'Registration failed. Please try again.',
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
                    error.textContent = 'Please enter a valid email address';
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
                const error = document.querySelector(
                    '.error-register.password',
                );
                error.textContent =
                    'Password must be between 8 and 32 characters (A-Z, a-z, 0-9)';
                error.classList.remove('hidden');
            }

            if (
                name === 'confirmPassword' &&
                value !== document.getElementById('register-password').value
            ) {
                const error = document.querySelector(
                    '.error-register.confirmPassword',
                );
                error.textContent = 'Password mismatch';
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

        autoHideErrorContainer(errorContainer);

        if (isEmpty(email, password)) {
            displayError(
                errorContainer,
                errorElement,
                'The fields below must not be empty',
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
                        title: 'Login successful',
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
                        data.message || 'Login failed. Please try again.',
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

        autoHideErrorContainer(errorContainer);

        if (isEmpty(email)) {
            displayError(
                errorContainer,
                errorElement,
                'The fields below must not be empty',
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
                        title: 'New password sent to your email address',
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
                        data.message ||
                            'Reset password failed. Please try again.',
                    );
                }
            });
    });
}

// Hide error container after 5 seconds if visible
function autoHideErrorContainer(container) {
    if (!container.classList.contains('hidden')) {
        setTimeout(() => {
            container.classList.add('hidden');
        }, 5000);
    }
}

// Show error in container
function displayError(container, errorElement, message) {
    container.classList.remove('hidden');
    errorElement.textContent = message;
}

// Check for empty fields
function isEmpty(...fields) {
    return fields.some((field) => !field || !field.trim().length);
}
