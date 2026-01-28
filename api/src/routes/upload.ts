import express, { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Configure Cloudinary with credentials from environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Missing Cloudinary configuration in environment variables');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload endpoint for images
router.post('/image', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Upload to Cloudinary with signature
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'dineease/menu-items',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file!.buffer);
    });

    res.json({
      secure_url: (uploadResult as any).secure_url,
      public_id: (uploadResult as any).public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: (error as any).message });
  }
});

export default router;
