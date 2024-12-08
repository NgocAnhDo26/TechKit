const registerForm = document.getElementById('register-form');
const submit = document.querySelector('.submit');
console.log(submit);
registerForm.addEventListener(
    'blur',
    (e) => {
        if (e.target.name === 'email') {
            fetch(`/auth/register?email=${urlencoded(e.target.value)}`).then(
                (res) => {},
            );
        }
    },
    true,
);
registerForm.addEventListener('focus', (e) => {}, true);
