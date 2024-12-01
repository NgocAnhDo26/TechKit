/* Cart */
document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.querySelector('.cart-wrapper');
    const cartDropdown = cartIcon.querySelector('.group-hover\\:block');

    cartIcon.addEventListener('mouseenter', function () {
        clearTimeout(cartIcon.__timer);
        cartDropdown.classList.remove('hidden');
    });

    cartIcon.addEventListener('mouseleave', function () {
        cartIcon.__timer = setTimeout(() => {
            cartDropdown.classList.add('hidden');
        }, 1300);
    });

    cartDropdown.addEventListener('mouseenter', function () {
        clearTimeout(cartIcon.__timer);
    });

    cartDropdown.addEventListener('mouseleave', function () {
        cartIcon.__timer = setTimeout(() => {
            cartDropdown.classList.add('hidden');
        }, 1300);
    });
});

/* Mobile menu */
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.getElementById('hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    hamburgerBtn.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });
});



// /* search icon show/hide */
// Document.getElementById('search-icon').addEventListener('click', function () {
//     Let searchField = document.getElementById('search-field');
//     If (searchField.classList.contains('hidden')) {
//         SearchField.classList.remove('hidden');
//         SearchField.classList.add('search-slide-down');
//     } else {
//         SearchField.classList.add('hidden');
//         SearchField.classList.remove('search-slide-down');
//     }
// });

function toggleDropdown(id, show) {
    const dropdown = document.getElementById(id);
    if (show) {
        dropdown.classList.remove('hidden');
    } else {
        dropdown.classList.add('hidden');
    }
}

function changeImage(element) {
    let mainImage = document.getElementById('main-image');
    mainImage.src = element.getAttribute('data-full');
}

/* Single page product count */
document.addEventListener('DOMContentLoaded', function () {
    const decreaseButton = document.getElementById('decrease');
    const increaseButton = document.getElementById('increase');
    const quantityInput = document.getElementById('quantity');

    if (decreaseButton && increaseButton && quantityInput) {
        decreaseButton.addEventListener('click', function () {
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantity -= 1;
                quantityInput.value = quantity;
            }
            updateButtons();
        });

        increaseButton.addEventListener('click', function () {
            let quantity = parseInt(quantityInput.value);
            quantity += 1;
            quantityInput.value = quantity;
            updateButtons();
        });

        function updateButtons() {
            if (parseInt(quantityInput.value) === 1) {
                decreaseButton.setAttribute('disabled', true);
            } else {
                decreaseButton.removeAttribute('disabled');
            }
        }
    }
});

/* Single product tabs */
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    console.log(tabs.length, contents.length);

    if (tabs.length > 0 && contents.length > 0) {
        tabs.forEach((tab) => {
            tab.addEventListener('click', function () {
                tabs.forEach((t) => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                contents.forEach((c) => c.classList.add('hidden'));

                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                document
                    .querySelector(`#${this.id.replace('-tab', '-content')}`)
                    .classList.remove('hidden');
            });
        });

        tabs[0].click();
    }
});



/* Cart page */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.cart-increment').forEach((button) => {
        button.addEventListener('click', function () {
            let quantityElement = this.previousElementSibling;
            let quantity = parseInt(quantityElement.textContent, 10);
            quantityElement.textContent = quantity + 1;
        });
    });

    document.querySelectorAll('.cart-decrement').forEach((button) => {
        button.addEventListener('click', function () {
            let quantityElement = this.nextElementSibling;
            let quantity = parseInt(quantityElement.textContent, 10);
            if (quantity > 1) {
                quantityElement.textContent = quantity - 1;
            }
        });
    });
});
