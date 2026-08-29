import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"

dotenv.config()

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Missing Cloudinary environment variables');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
}); 

export const uploadToCloudinary = async (filePath: string, publicId?: string) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
    });
    return uploadResult;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw error;
  }
};