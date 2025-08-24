import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

console.log(process.env.CLOUDINARY_NAME);
console.log(process.env.CLOUDINARY_KEY);
console.log(process.env.CLOUDINARY_SECRET);


export default cloudinary;
/**
 * Upload an image file to Cloudinary
 * @param {File|Blob} file - The file object from formData
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export async function uploadImage(file, folder = "heer-chain") {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url); // ✅ return Cloudinary URL
      })
      .end(buffer);
  });
}


/**
 * Remove an image from Cloudinary
 * @param {string} publicId - The Cloudinary public_id of the image
 * @returns {Promise<object>} - Cloudinary deletion response
 */
export async function removeImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result; // { result: "ok" } if success
  } catch (error) {
    throw new Error("Failed to delete image: " + error.message);
  }
}
