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

export const getImage = (public_id) => ({
  url: getUrl(public_id),
  public_id: public_id,
});

// Upload avatar image to Cloudinary
export const uploadAvatarImage = async (address, folder) =>
  await cloudinary.uploader
    .upload(address, {
      ...(folder && { folder: folder }), // If folder is specified, add it
      public_id: 'avatar_image', // Optional: Set a default public ID
      transformation: [
        {
          width: 100, // Set width for the avatar
          height: 100, // Set height for the avatar
          crop: 'fill', // Resize and crop to fit the dimensions
        },
      ],
    })
    .catch((error) => {
      console.error('Error uploading avatar image:', error);
      return { success: false, message: 'Failed to upload avatar image' };
    });

