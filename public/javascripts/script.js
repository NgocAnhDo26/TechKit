/* Mobile menu */
document.addEventListener('DOMContentLoaded', function () {
  const hamburgerBtn = document.getElementById('hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  hamburgerBtn.addEventListener('click', function () {
    mobileMenu.classList.toggle('hidden');
  });
});