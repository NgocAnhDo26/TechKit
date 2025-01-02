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
            error = document.querySelector('.error-submit-register'),
            errorContainer = document.querySelector(
                '.error-submit-container-register',
            );

        if (!errorContainer.classList.contains('hidden')) {
            setTimeout(() => {
                errorContainer.classList.add('hidden');
            }, 5000);
        }

        if (
            !password.length ||
            !email.length ||
            !name.length ||
            !confirmPassword.length
        ) {
            errorContainer.classList.remove('hidden');
            error.textContent = 'The fields below must not be empty';
            return;
        }

        const errors = document.querySelectorAll('.error-register');
        const hasVisibleError = Array.from(errors).some(
            (err) => !err.classList.contains('hidden'),
        );
        if (hasVisibleError) {
            errorContainer.classList.remove('hidden');
            error.textContent = 'Please check your responses and try again';
            return;
        }
        // Submit registration
        await fetch(`/auth/register`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // Registration successful
                    Swal.fire({
                        icon: 'success',
                        title: 'Activation email sent to your email address',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });
                } else {
                    // Handle errors, display error messages to the user
                    errorContainer.classList.remove('hidden');
                    error.textContent =
                        data.message ||
                        'Registration failed. Please try again.';
                }
            });
    });

    registerForm.addEventListener(
        'blur',
        async (e) => {
            if (e.target.value !== '') {
                if (e.target.name === 'email') {
                    const error = document.querySelector(
                        '.error-register.email',
                    );
                    if (!emailPattern.test(e.target.value)) {
                        error.textContent =
                            'Please enter a valid email address';
                        error.classList.remove('hidden');
                    }
                    await fetch(
                        `/auth/register?email=${encodeURIComponent(e.target.value)}`,
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.error) {
                                error.textContent = data.error;
                                error.classList.remove('hidden');
                            }
                        })
                        .catch((err) => console.error('Error:', err));
                }
                if (
                    e.target.name === 'password' &&
                    !passwordPattern.test(e.target.value)
                ) {
                    const error = document.querySelector(
                        '.error-register.password',
                    );
                    error.textContent =
                        'Password must be between 8 and 32 characters (A-Z, a-z, 0-9)';
                    error.classList.remove('hidden');
                }
                if (
                    e.target.name === 'confirmPassword' &&
                    e.target.value !==
                        document.getElementById('register-password').value
                ) {
                    const error = document.querySelector(
                        '.error-register.confirmPassword',
                    );
                    error.textContent = 'Password mismatch';
                    error.classList.remove('hidden');
                }
            }
        },
        true,
    );

    registerForm.addEventListener(
        'focus',
        (e) => {
            if (e.target.name !== 'submit') {
                const error = document.querySelector(
                    `.error-register.${e.target.name}`,
                );
                error.classList.add('hidden');
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
            error = document.querySelector('.error-submit-login'),
            errorContainer = document.querySelector(
                '.error-submit-container-login',
            );

        if (!errorContainer.classList.contains('hidden')) {
            setTimeout(() => {
                errorContainer.classList.add('hidden');
            }, 5000);
        }

        if (!email.length || !password.length) {
            errorContainer.classList.remove('hidden');
            error.textContent = 'The fields below must not be empty';
            return;
        }

        // Submit login
        await fetch(`/auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
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
                        // Redirect to '/'
                        window.location.href = data.redirectUrl;
                    });
                } else {
                    // Handle errors, display error messages to the user
                    errorContainer.classList.remove('hidden');
                    error.textContent =
                        data.message || 'Login failed. Please try again.';
                }
            });
    });
}

// Forgot Password
if (forgotPasswordSubmit) {
    forgotPasswordSubmit.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-password-email').value,
            error = document.querySelector('.error-submit-forgot-password'),
            errorContainer = document.querySelector(
                '.error-submit-container-forgot-password',
            );

        if (!errorContainer.classList.contains('hidden')) {
            setTimeout(() => {
                errorContainer.classList.add('hidden');
            }, 5000);
        }

        if (!email.length) {
            errorContainer.classList.remove('hidden');
            error.textContent = 'The fields below must not be empty';
            return;
        }

        // Submit reset password
        await fetch(`/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            }),
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
                        // Redirect to login page
                        window.location.href = '/auth/login';
                    });
                } else {
                    // Handle errors, display error messages to the user
                    errorContainer.classList.remove('hidden');
                    error.textContent =
                        data.message ||
                        'Reset password failed. Please try again.';
                }
            });
    });
}
