import { cloudinary } from '../config/config.js';
// Get url image from cloudinary
export const getUrl = (address) =>
    cloudinary.url(address, {
        fetch_format: 'auto',
        quality: 'auto',
    });

// Upload image to cloudinary
export const uploadImage = async (address, folder) =>
    await cloudinary.uploader
        .upload(address, {
            ...(folder && { folder: folder }), // If folder is not null, add folder to upload
        })
        .catch((error) => {
            console.log(error);
        });