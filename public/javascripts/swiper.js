/* Swiper slider */
// Const swiper = new Swiper('.swiper', {
//     // Optional parameters
//     SlidesPerView: 4,
//     Direction: 'vertical',
//     Loop: true,

//     // If we need pagination
//     Pagination: {
//         El: '.swiper-pagination',
//     },

//     // Navigation arrows
//     Navigation: {
//         NextEl: '.swiper-button-next',
//         PrevEl: '.swiper-button-prev',
//     },

//     // And if we need scrollbar
//     Scrollbar: {
//         El: '.swiper-scrollbar',
//     },
//     Breakpoints: {
//         1024: {
//             SlidesPerView: 6,
//         },
//     },
// });

// // if (typeof Swiper !== 'undefined') {
let swiper = new Swiper('.swiper', {
    // Observer: true,
    // ObserveParents: true,
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
