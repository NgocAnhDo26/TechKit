import { v2 as cloudinary } from 'cloudinary';
import { readdirSync } from 'fs';
import { basename, extname, join } from 'path';
import { stringify } from 'querystring';

// Function to get all image files from a directory
function getAllImageFiles(directory) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    try {
        // Read all files in the directory and filter by image extensions
        return readdirSync(directory).filter(file =>
            imageExtensions.includes(extname(file).toLowerCase())
        );
    } catch (err) {
        console.error(`Error reading directory "${directory}": ${err.message}`);
        return []; // Return an empty array if the directory is inaccessible
    }
}

// // Directories to search
// const directories = ['product_image/gaming', 'product_image/office', 'product_image/graphic'];
// let images = [];

// // Loop through directories and collect images
// for (const directory of directories) {
//     const imageList = getAllImageFiles(directory);
//     images = images.concat(imageList.map(image => join(directory, image))); // Include full path
// }

// // Log the final images array
// console.log('Images:', images);
// Configuration
cloudinary.config({ 
    cloud_name: 'dqi9dab5p', 
    api_key: '577691263927267', 
    api_secret: 'fLcfuziotphSUzOdu3Nf_ZDCgOc' // Click 'View API Keys' above to copy your API secret
});

const assetUrls = [];
async function fetchResources() {
      try {
        const result = await cloudinary.api.resources();
        // Collect URLs from the result
        result.resources.forEach(asset => {
          assetUrls.push(asset.secure_url); // Use secure_url for HTTPS URLs
        });
      } catch (error) {
        console.error(`Error fetching resources:`, error);
      }
    // Log all collected URLs
    console.log('Collected Asset URLs:', assetUrls);
};
fetchResources()

// (async function() {
//     // Configuration
//     cloudinary.config({ 
//         cloud_name: 'dqi9dab5p', 
//         api_key: '577691263927267', 
//         api_secret: 'fLcfuziotphSUzOdu3Nf_ZDCgOc' // Click 'View API Keys' above to copy your API secret
//     });
//     for (const image_location of images) {
//         let public_id_with_ext = basename(image_location);
//         let public_id = public_id_with_ext.replace(extname(public_id_with_ext), '');

//             // Upload an image
//         const uploadResult = await cloudinary.uploader
//         .upload(
//             image_location, {
//                 public_id: public_id,
//             }
//         )
//         .catch((error) => {
//             console.log(error);
//         });
//         console.log(uploadResult);
//     }
    
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url(public_id, {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });  
//     console.log(optimizeUrl);
// })();