import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';
import { Express } from 'express'; 
import config from '../config';

// Ensure that the file type from multer is properly handled
export const uploadImage = async (file: Express.Multer.File): Promise<string> => {
  try {
    // Create a new FormData instance
    const formData = new FormData();

    // Append the buffer to FormData
    formData.append('file', Readable.from(file.buffer), file.originalname);

    // Adjust the URL and headers based on your setup
    const response = await axios.post(
      "https://cloudinary-upload-server-psi.vercel.app/api/v1/fileuploader",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": config.fileUpload.key,
        },
      }
    );

 

    return await response?.data?.fileUrl;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};
