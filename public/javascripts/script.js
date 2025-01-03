/* Mobile menu */
document.addEventListener('DOMContentLoaded', function () {
  const hamburgerBtn = document.getElementById('hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  hamburgerBtn.addEventListener('click', function () {
    mobileMenu.classList.toggle('hidden');
  });
});

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
