document.addEventListener('DOMContentLoaded', function () {
    const swipers = document.querySelectorAll('.swiper-container');
    swipers.forEach((swiperEl) => {
        new Swiper(swiperEl, {
            observer: true,
            observeParents: true,
            loop: true,
            slidesPerView: 3,
            spaceBetween: 30,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    });
});
