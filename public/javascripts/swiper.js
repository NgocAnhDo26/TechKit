/* swiper slider */
// const swiper = new Swiper('.swiper', {
//     // Optional parameters
//     slidesPerView: 4,
//     direction: 'vertical',
//     loop: true,

//     // If we need pagination
//     pagination: {
//         el: '.swiper-pagination',
//     },

//     // Navigation arrows
//     navigation: {
//         nextEl: '.swiper-button-next',
//         prevEl: '.swiper-button-prev',
//     },

//     // And if we need scrollbar
//     scrollbar: {
//         el: '.swiper-scrollbar',
//     },
//     breakpoints: {
//         1024: {
//             slidesPerView: 6,
//         },
//     },
// });

// // if (typeof Swiper !== 'undefined') {
let swiper = new Swiper('.swiper', {
    // observer: true,
    // observeParents: true,
    slidesPerView: 4,
    loop: true,
    autoplay: {
        delay: 3000,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        1024: {
            slidesPerView: 6,
        },
    },
});

// // swiper = new Swiper('.main-slider', {
// //     observer: true,
// //     observeParents: true,
// //     slidesPerView: 1,
// //     loop: true,
// //     autoplay: {
// //         delay: 5000,
// //     },
// //     navigation: {
// //         nextEl: '.swiper-button-next',
// //         prevEl: '.swiper-button-prev',
// //     },
// // });
// // // }
