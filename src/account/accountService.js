import { prisma } from '../config/config.js';
import { cloudinary } from '../config/config.js';

export const findAccountByQuery = async (query) => {
    const filter = { AND: [] };
    const order = [];
    if (query.name) {
        filter.AND.push = { name: query.name };
    }
    if (query.email) {
        filter.AND.push = { email: query.email };
    }
    if (query.emailOrder) {
        order.push({ email: query.emailOrder });
    }
    if (query.nameOrder) {
        order.push({ name: query.nameOrder });
    }
    if (query.createTimeOrder) {
        order.push({ name: query.createTimeOrder });
    }
    return await prisma.account.findMany({ where: filter, orderBy: order });
};

// get url image from cloudinary
export const getUrl = (address) => {
    return cloudinary.url(address, {
        fetch_format: 'auto',
        quality: 'auto',
    });
};

// upload image to cloudinary
// const uploadResult = await cloudinary.uploader
//     .upload('public/images/profile.png', {
//         public_id: 'default',
//         folder: 'avatar',
//     })
//     .catch((error) => {
//         console.log(error);
//     });

// console.log(uploadResult);